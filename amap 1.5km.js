// ==UserScript==
// @name         1.5 km
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       Li,Chao
// @match        https://ditu.amap.com/*
// ==/UserScript==

/* jshint ignore:start */
$ = document.querySelector.bind(document);
const radius = 1500;
const div = document.createElement('div');
div.innerHTML = '<span style="color:red">*</span>'
document.body.append(div)
const commonStyle =`
                display:flex;
                justify-content: space-around;
                align-items: center;
                position: absolute;
                border: 1px solid red;
                background: rgba(255, 0, 0, 0.1);
                border-radius: 50%;
                pointer-events: none;
                transform: translate(-50%,-50%);`
let timer;
const delayDraw = () => {
        clearTimeout(timer)
        timer = setTimeout(() => {
            timer = 0;
            draw()
        }, 500);
    }

document.addEventListener('wheel', delayDraw)
document.addEventListener('dblclick', delayDraw)
window.onload = function () {
    const ob = new MutationObserver(mutations => mutations.forEach(mutation => {
        console.log(mutation)
        const { addedNodes } = mutation;
        if (addedNodes.length) {
            console.log('draw')
            draw()
        } else {
            console.log('hidden')
            div.style.display = 'none';
        }
    }))
    const config = { childList: true }
    ob.observe($('.amap-overlays'), config)
}

const getUnit = text => {
    const units = { 米: '', 公里: '000' }
    return +text.replace(' ', '').replace(/\D*$/, unit => units[unit]);
}

function draw() {
    const container = $('.amap-overlays .amap-info');
    if (!container) return;
    container.insertBefore(div,container.children[0])
    const unit = getUnit($('.amap-scale-text').textContent)
    const diameter = (radius * 2 / unit) * parseFloat($('.amap-scale-middle').style.width)
    const offset = parseInt(getComputedStyle($('.poi_tip_foot'), '::before').getPropertyValue('margin-left'));
    const cssText = `margin-left:${offset-6}px;margin-top:${offset}px;width:${diameter}px;height:${diameter}px;`;
    div.style.cssText = commonStyle + cssText;
}


/* jshint ignore:end */