# Desu Desu Talk!
Добавляем немного стеганографии и криптографии в обычный картинкопостинг на имджбордах десу. 256 битный ECC и 256 битный AES для защищённого *псевдонимного* общения.

# 8chan? 4chan? Refer to **[english guide](https://github.com/desudesutalk/desudesutalk/wiki/How-to-use-this-script)**!

### Как установить
Потербуется Google Chrome с [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) или Firefox с [Greasemonkey](https://addons.mozilla.org/firefox/addon/greasemonkey/) 

Так же потребуется [Куклоскрипт](https://github.com/SthephanShinkufag/Dollchan-Extension-Tools) (для 8chan-а и 4chan-а он не нужен)

После чего ставим скрипт [по ссылке](https://github.com/desudesutalk/desudesutalk/raw/master/ddt.user.js) и наслаждаемся.

О том, как пользоваться скриптом, можно [почитать в wiki](https://github.com/desudesutalk/desudesutalk/wiki/%D0%9A%D0%B0%D0%BA-%D0%BF%D0%BE%D0%BB%D1%8C%D0%B7%D0%BE%D0%B2%D0%B0%D1%82%D1%8C%D1%81%D1%8F).

## Доска для тестирования
[lainchan.org/layer](https://lainchan.org/layer/)

### Используемые библиотеки
1. [ECC](https://github.com/indutny/elliptic)
2. [sjcl](http://bitwiseshiftleft.github.io/sjcl/)
5. [pako](https://github.com/nodeca/pako)
6. [Zepto](http://zeptojs.com/)
7. [Identicon5](https://github.com/FrancisShanahan/Identicon5)
8. [UTF-8 array to DOMString and vice versa](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Base64_encoding_and_decoding#Appendix.3A_Decode_a_Base64_string_to_Uint8Array_or_ArrayBuffer)
9. [highlight](https://github.com/isagalaev/highlight.js)
10. [JPEG codec](https://github.com/owencm/js-steg)

### Подробнее про алгоритм стеганографии 
[F5 Steganography](https://code.google.com/p/f5-steganography/)
