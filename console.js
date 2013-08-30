(function () {
    var element;

    function createElement(cls, content, name) {
        var elem = document.createElement(name || 'div');
        if (content) {
            elem.innerHTML = content;
        }
        elem.classList.add('mobile-console__' + cls);
        return elem;
    }

    function scrollToBottom() {
        element.scrollTop = element.scrollHeight;
    }

    function Inspect(obj, key) {
        var content = createElement('log'),
            top = createElement('top'),
            node = createElement('node'),
            elemsCreated = false,
            keyNode, text, props;
        
        if (key) {
            keyNode = createElement('key', key + ':', 'span');
            top.appendChild(keyNode);
        }

        content.appendChild(top);
        top.appendChild(node);
        if (typeof obj === 'number') {
            node.innerHTML = obj;
            node.classList.add('number');
        } else if (typeof obj === 'string') {
            node.innerHTML = '"' + obj + '"';   
            node.classList.add('string');
        } else if (obj === null) {
            node.innerHTML = 'null';   
            node.classList.add('null');
        } else if (obj === false || obj === true) {
            node.innerHTML = '' + obj;
        } else if (obj instanceof Function) {
            text = obj.toString();
            if (text.indexOf('[native code]') !== -1) {
                node.innerHTML = text;
            } else {
                node.innerHTML = text.split(/(\{)/).slice(0, 2).join('');
            }
        } else {

            node.innerHTML = obj.constructor.name;
            node.classList.add('inspect');
            if (Array.isArray(obj)) {
                node.innerHTML = '[' + obj.length + ']';
            }

            props = createElement('props');

            node.addEventListener('click', function () {
                var elem, key;
                if (node.classList.contains('inspect')) {
                    if (!elemsCreated) {
                        for (key in obj) {
                            elem = Inspect(obj[key], key);
                            props.appendChild(elem);
                        }
                        elemsCreated = true;
                    }
                    node.classList.remove('inspect');
                    node.classList.add('opened');
                    props.classList.add('visible');
                } else {
                    node.classList.add('inspect');
                    node.classList.remove('opened');
                    props.classList.remove('visible');
                }
            }, false);

            content.appendChild(props);
        }

        return content;
    }

    function createConsoleBlock() {
        element = createElement('holder');
        document.body.appendChild(element);
    }

    if(/android|webos|iphone|ipad|ipod|blackberry|window\sphone/i.test(navigator.userAgent)) {
        window.addEventListener('load', function () {
            console.error = console.log = function (message) {
                if (!element) {
                    createConsoleBlock();
                }
                element.appendChild(Inspect(message));
                scrollToBottom();
            };
        }, false);
    }
}());
