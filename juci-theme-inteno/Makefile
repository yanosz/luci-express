TARGET:=juci-theme-inteno
CSS:=htdocs/css/80-$(TARGET).css
JS:=htdocs/js/80-$(TARGET).js
HTML:=htdocs/js/90-$(TARGET)-tpl.js
CP:=cp -Rp
INSTALL_DIR=mkdir -p

all: files $(CSS) $(JS) $(HTML);
	
.PHONY: files
files: 
	$(INSTALL_DIR) ./htdocs/css
	$(INSTALL_DIR) ./htdocs/js
	$(CP) ./src/img htdocs/
	$(CP) ./src/fonts htdocs/

STYLES:=$(wildcard src/css/*.css) 
CODE:=$(wildcard src/*.js src/pages/*.js src/widgets/*.js)
TEMPLATES:=$(wildcard src/widgets/*.html) $(wildcard src/pages/*.html)

$(CSS): $(STYLES)
	cat $(STYLES) > $@

$(JS): $(CODE)
	cat $(CODE) > $@
	
$(HTML): $(TEMPLATES)
	./juci-theme-build-templates $(TEMPLATES) $(HTML) 

clean: 
	rm -rf htdocs
