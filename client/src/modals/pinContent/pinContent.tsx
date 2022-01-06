import './pinContent.css';

export function InfoWindowContent(
  placeName: string,
  placeAddress: string,
  placeRoadAddress: string,
): string {
  const content =
    "<div class='windowInfo-content-container'>" +
    "  <div class='windowInfo-content-section'>" +
    "    <div class='windowInfo-content-title'>장소 이름 :</div>" +
    "    <div class='windowInfo-content-property'>" +
    placeName +
    '    </div>' +
    '  </div>' +
    "  <div class='windowInfo-content-section'>" +
    "    <div class='windowInfo-content-title'>지번 주소 :</div>" +
    "    <div class='windowInfo-content-property'>" +
    placeAddress +
    '    </div>' +
    '  </div>' +
    "  <div class='windowInfo-content-section'>" +
    "    <div class='windowInfo-content-title'>도로명 주소 :</div>" +
    "    <div class='windowInfo-content-property'>" +
    placeRoadAddress +
    '    </div>' +
    '  </div>' +
    '</div>';
  return content;
}
