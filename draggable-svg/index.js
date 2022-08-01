// https://www.petercollingridge.co.uk/tutorials/svg/interactive/dragging/
function enableDraggableSvgDom(targetSvgDom) {
  let selectedSvgChildDom;
  let offset;
  targetSvgDom.addEventListener("mousedown", startDrag);
  targetSvgDom.addEventListener("mousemove", drag);
  targetSvgDom.addEventListener("mouseup", endDrag);
  targetSvgDom.addEventListener("mouseleave", endDrag);
  targetSvgDom.addEventListener("touchstart", startDrag);
  targetSvgDom.addEventListener("touchmove", drag);
  targetSvgDom.addEventListener("touchend", endDrag);
  targetSvgDom.addEventListener("touchleave", endDrag);
  targetSvgDom.addEventListener("touchcancel", endDrag);
  function getMousePosition(event) {
    const CTM = targetSvgDom.getScreenCTM();
    if (event.touches) {
      event = event.touches[0];
    }
    return {
      x: (event.clientX - CTM.e) / CTM.a,
      y: (event.clientY - CTM.f) / CTM.d,
    };
  }
  function startDrag(event) {
    if (event.target.classList.contains("draggable")) {
      selectedSvgChildDom = event.target;
      offset = getMousePosition(event);
      console.log(offset);
      // Get all the transforms currently on this element
      const transforms = selectedSvgChildDom.transform.baseVal;

      // Ensure the first transform is a translate transform
      // 名寄せ処理している transformにtranslateプロパティがない場合のハンドリング
      if (
        transforms.length === 0 ||
        transforms.getItem(0).type !== SVGTransform.SVG_TRANSFORM_TRANSLATE
      ) {
        // Create an transform that translates by (0, 0)
        const translate = targetSvgDom.createSVGTransform();
        translate.setTranslate(0, 0);
        // Add the translation to the front of the transforms list
        selectedSvgChildDom.transform.baseVal.insertItemBefore(translate, 0);
      }
      // Get initial translation amount
      transform = transforms.getItem(0);
      offset.x -= transform.matrix.e;
      offset.y -= transform.matrix.f;
    }
  }
  function drag(event) {
    if (selectedSvgChildDom) {
      event.preventDefault();
      var coord = getMousePosition(event);
      transform.setTranslate(coord.x - offset.x, coord.y - offset.y);
    }
  }
  function endDrag(event) {
    selectedSvgChildDom = null;
  }
}

const workspaceDom = document.querySelector(".workspace");
enableDraggableSvgDom(workspaceDom);
