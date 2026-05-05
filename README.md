# TW – Portfolio

Projekt je dostupný na:
https://michalhluch.github.io/Portfolio/

## Technologie
HTML, CSS, JavaScript

## Popis práce

Zvolil jsem méně častý přístup jak se web chová a to tzv. „section scroll“, kdy je na obrazovce vždy zobrazena pouze jedna sekce zabírající 100 % viewportu (šířky i výšky). Tento přístup působí moderně a umožňuje lépe kontrolovat přechody mezi jednotlivými částmi webu.

Během vývoje jsem narazil na několik problémů, například možnost přepnutí do jiné sekce pomocí klávesy TAB, což narušovalo layout, nebo zobrazení obsahu na menších obrazovkách. Tyto problémy se mi podařilo vyřešit (např. použitím atributu inert a úpravou scroll logiky).

Díky tomu, že pracuje po sekcích jsem si mohl více pohrát s animacemi přechodů. Využil jsem především CSS transformace pro plynulé přechody prvků (např. posun z okrajů obrazovky), což zlepšuje celkový vizuální dojem.

Využil jsem font z Google Fonts jménem DM Sans pro běžný text a pro nadpisy font Bebas Neue.

## Vzhled

Design webu je založen na tmavém pozadí s modrými akcenty. Pro oživení jsem přidal tzv. „background blobs“ – rozmazané prvky s průhledností, které vytvářejí dynamické pozadí.

Barevné schéma je definováno pomocí CSS proměnných (:root), což umožňuje snadnou změnu vzhledu celého webu.

Pro responzivitu textu jsem využíval funkci clamp() a dále klasické @media queries. Snažil jsem se také o konzistentní design napříč celým webem opakovaným využíváním vizuálních prvků.

## Použití AI

Během vývoje jsem využil AI zejména při implementaci section scrollingu v JavaScriptu, aby bylo zajištěno správné chování na všech zařízeních. Veškerý použitý kód však plně chápu.