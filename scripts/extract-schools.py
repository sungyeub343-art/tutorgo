"""전국초중등학교위치표준데이터(.xls)에서 경남 학교 목록을 뽑아 scripts/data/schools.json으로 저장합니다.

사용법: python -I scripts/extract-schools.py <엑셀 파일 경로>
필요 패키지: xlrd
"""
import json
import sys
from pathlib import Path

import xlrd

SLUGS = {
    "창원시": "changwon", "진주시": "jinju", "통영시": "tongyeong", "사천시": "sacheon",
    "김해시": "gimhae", "밀양시": "miryang", "거제시": "geoje", "양산시": "yangsan",
    "의령군": "uiryeong", "함안군": "haman", "창녕군": "changnyeong", "고성군": "goseong",
    "남해군": "namhae", "하동군": "hadong", "산청군": "sancheong", "함양군": "hamyang",
    "거창군": "geochang", "합천군": "hapcheon",
}
LEVELS = {"초등학교": "elementary", "중학교": "middle", "고등학교": "high"}

sheet = xlrd.open_workbook(sys.argv[1]).sheet_by_index(0)
header = sheet.row_values(1)
rows = [dict(zip(header, sheet.row_values(i))) for i in range(2, sheet.nrows)]

schools = {slug: {level: [] for level in LEVELS.values()} for slug in SLUGS.values()}
for row in rows:
    address = row["소재지도로명주소"].split()
    if row["시도교육청명"] != "경상남도교육청" or row["운영상태"] != "운영" or len(address) < 3:
        continue
    slug, level = SLUGS.get(address[1]), LEVELS.get(row["학교급구분"])
    if not slug or not level:
        continue
    # 창원은 구 단위로 묶어서 보여줍니다
    district = address[2] if slug == "changwon" else ""
    schools[slug][level].append({"name": row["학교명"].strip(), "district": district})

for levels in schools.values():
    for items in levels.values():
        items.sort(key=lambda item: (item["district"], item["name"]))

output = Path(__file__).parent / "data" / "schools.json"
output.parent.mkdir(exist_ok=True)
output.write_text(json.dumps({"source": f"전국초중등학교위치표준데이터 (기준일 {rows[0]['데이터기준일자']})", "regions": schools}, ensure_ascii=False, indent=1), encoding="utf-8")
print(f"saved {sum(len(items) for levels in schools.values() for items in levels.values())} schools to {output}")
