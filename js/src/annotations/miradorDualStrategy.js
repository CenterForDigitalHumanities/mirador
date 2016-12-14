(function($) {

  $.MiradorDualStrategy = function(options) {
    jQuery.extend(this, {
      
    }, options);
    this.init();
  };
  
  $.MiradorDualStrategy.prototype = {
    init: function() {
      
    },
    
    isThisType: function(annotation) {
      if (annotation.on && typeof annotation.on === 'object' &&
          annotation.on.selector && typeof annotation.on.selector === 'object' &&
          annotation.on.selector['@type'] === 'oa:Choice' &&
          annotation.on.selector.default && typeof annotation.on.selector.default === 'object' &&
          annotation.on.selector.default.value && typeof annotation.on.selector.default.value === 'string' &&
          annotation.on.selector.item && typeof annotation.on.selector.item === 'object' &&
          annotation.on.selector.item.value && typeof annotation.on.selector.item.value === 'string'
        ) {
        return annotation.on.selector.default.value.indexOf('xywh=') === 0 && annotation.on.selector.item.value.indexOf('<svg') === 0;
      }
      return false;
    },
    
    buildAnnotation: function(options) {
      var oaAnno = options.annotation,
          window = options.window,
          overlay = options.overlay,
          svg = overlay.getSVGString(overlay.draftPaths),
          bounds = overlay.draftPaths[0].bounds;
      oaAnno.on = {
        "@type": "oa:SpecificResource",
        "full": window.canvasID,
        "selector": {
          "@type": "oa:Choice",
          "default": {
            "@type": "oa:FragmentSelector",
            "value": "xywh=" + bounds.x + "," + bounds.y + "," + bounds.width + "," + bounds.height
          },
          "item": {
            "@type": "oa:SvgSelector",
            "value": svg
          }
        },
        "within": {
          "@id": window.loadedManifest,
          "@type": "sc:Manifest"
        }
      };
      return oaAnno;
    },
    
    parseRegion: function(annotation, osdRegionDrawTool) {
      if (this.isThisType(annotation)) {
        return osdRegionDrawTool.svgOverlay.parseSVG(annotation.on.selector.item.value, annotation);
      }
    },
  };
  
}(Mirador));