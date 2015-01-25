// Generated by CoffeeScript 1.7.1
var injected,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

injected = injected || (function() {
  var TinyInspect, enabled, inspector;
  enabled = false;
  TinyInspect = (function() {
    function TinyInspect() {
      this.highlight = __bind(this.highlight, this);
      this.logg = __bind(this.logg, this);
      this.$target = this.$cacheEl = document.body;
    }

    TinyInspect.prototype.createNodes = function() {
      var $template, template;
      template = "<div class='tl-wrap'> <div class='tl-overlayV'></div> <div class='tl-overlayH'></div> <div class='tl-overlay'></div> <div class='tl-codeWrap'> <code class='tl-code language-markup'>&lt;html&gt;</code> </div> </div>";
      $template = this.fragmentFromString(template);
      document.body.appendChild($template);
      this.$wrap = document.querySelector('.tl-wrap');
      this.$overlay = document.querySelector('.tl-overlay');
      this.$overlayV = document.querySelector('.tl-overlayV');
      this.$overlayH = document.querySelector('.tl-overlayH');
      this.$code = document.querySelector('.tl-code');
      return this.highlight();
    };

    TinyInspect.prototype.registerEvents = function() {
      return document.addEventListener('mousemove', this.logg);
    };

    TinyInspect.prototype.logg = function(e) {
      var $clone, serializer, stringified;
      this.$target = e.target;
      if (this.$cacheEl === this.$target) {
        return;
      }
      this.$cacheEl = this.$target;
      this.layout();
      $clone = this.$target.cloneNode();
      serializer = new XMLSerializer();
      stringified = serializer.serializeToString($clone);
      stringified = stringified.slice(0, stringified.indexOf('>') + 1).replace(/( xmlns=")(.*?)(")/, '');
      this.$code.innerText = stringified;
      return this.highlight();
    };

    TinyInspect.prototype.layout = function() {
      var box, computedStyle, overlayHStyle, overlayStyle, overlayVStyle, rect;
      rect = this.$target.getBoundingClientRect();
      computedStyle = window.getComputedStyle(this.$target);
      box = {
        width: rect.width,
        height: rect.height,
        top: rect.top + window.pageYOffset,
        left: rect.left + window.pageXOffset,
        margin: {
          top: parseInt(computedStyle.marginTop, 10),
          right: parseInt(computedStyle.marginRight, 10),
          bottom: parseInt(computedStyle.marginBottom, 10),
          left: parseInt(computedStyle.marginLeft, 10)
        }
      };
      overlayVStyle = "top: " + box.top + "px; height: " + box.height + "px;";
      overlayHStyle = "top: " + window.pageYOffset + "px; left: " + box.left + "px; width: " + box.width + "px;";
      overlayStyle = "top: " + (box.top - box.margin.top) + "px; left: " + (box.left - box.margin.left) + "px; width: " + box.width + "px; height: " + box.height + "px; border-width: " + box.margin.top + "px " + box.margin.right + "px " + box.margin.bottom + "px " + box.margin.left + "px;";
      this.$overlayV.style.cssText = overlayVStyle;
      this.$overlayH.style.cssText = overlayHStyle;
      return this.$overlay.style.cssText = overlayStyle;
    };

    TinyInspect.prototype.destroy = function() {
      this.$wrap.classList.add('-out');
      document.removeEventListener('mousemove', this.logg);
      return setTimeout((function(_this) {
        return function() {
          return _this.$wrap.outerHTML = '';
        };
      })(this), 600);
    };

    TinyInspect.prototype.highlight = function() {
      return Prism.highlightElement(this.$code);
    };

    TinyInspect.prototype.fragmentFromString = function(strHTML) {
      var temp;
      temp = document.createElement('template');
      temp.innerHTML = strHTML;
      return temp.content;
    };

    return TinyInspect;

  })();
  inspector = new TinyInspect();
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    enabled = !enabled;
    if (enabled) {
      inspector.createNodes();
      return inspector.registerEvents();
    } else {
      return inspector.destroy();
    }
  });
  return true;
})();
