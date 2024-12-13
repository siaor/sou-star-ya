import {ModCtr} from "@/ctr/ModCtr";

/**
 * 元素移动工具类
 *
 * @param elId 元素ID
 * @param x 元素横坐标
 * @param y 元素纵坐标
 * @description 给元素添加移动事件
 * @author Siaor
 * @date 2024-12-06 12:00:00
 * */
export function addMoveEvDelay(elId: string, x: number, y: number) {
    setTimeout(function () {
        addMoveEv(elId, x, y);
    }, 700);
}

//需要禁用默认事件的组件
const needPreventMod = ['AppMod','GroupMod'];

export function addMoveEv(elId: string, x: number, y: number) {
    const el = document.getElementById(elId) as HTMLInputElement;
    if (!el) return;
    if(x===0 && y===0) {
        const rect = el.getBoundingClientRect();
        x = rect.left;
        y = rect.top;
    }

    let isDragging = false;
    let startX = x;
    let startY = y;

    //处理鼠标移动
    function handleMouseMove(event: MouseEvent) {
        if (!isDragging) return;

        event.stopPropagation();
        event.preventDefault();
        el.style.left = (event.clientX - startX) + 'px';
        el.style.top = (event.clientY - startY) + 'px';
    }
    //处理触摸移动
    function handleTouchMove(event: TouchEvent) {
        if (!isDragging) return;

        event.stopPropagation();
        event.preventDefault();

        const touch = event.touches[0]
        el.style.left = (touch.clientX - startX) + 'px';
        el.style.top = (touch.clientY - startY) + 'px';
    }

    //处理鼠标放开
    function handleMouseUp(event: MouseEvent) {
        event.stopPropagation();
        event.preventDefault();

        isDragging = false;
        el.style.cursor = 'grab';

        //todo:校验超出边框

        //todo:校验重叠

        startX = event.clientX - startX;
        startY = event.clientY - startY;
        el.removeEventListener('mousemove', handleMouseMove);
        el.removeEventListener('mouseup', handleMouseUp);
        ModCtr.updatePosition(elId,startX,startY);
    }
    //处理触摸结束
    function handleTouchEnd(event: TouchEvent) {
        event.stopPropagation();

        isDragging = false;
        el.style.cursor = 'grab';

        //todo:校验超出边框

        //todo:校验重叠

        const touch = event.changedTouches[0];
        startX = touch.pageX - startX;
        startY = touch.pageY - startY;
        el.removeEventListener('touchmove', handleTouchMove);
        el.removeEventListener('touchend', handleTouchEnd);
    }

    //处理鼠标离开
    function handleMouseLeave(event: MouseEvent) {
        event.stopPropagation();
        event.preventDefault();
        isDragging = false;
    }

    //处理触摸中断
    function handleTouchLeave(event: TouchEvent) {
        event.stopPropagation();
        isDragging = false;
    }

    //[鼠标点击]
    el.addEventListener('mousedown', function (event) {
        event.stopPropagation();
        if(needPreventMod.includes(el.getAttribute('mod') as string)) event.preventDefault();

        startX = event.clientX - startX;
        startY = event.clientY - startY;
        isDragging = true;
        el.style.cursor = 'grabbing';

        el.addEventListener('mousemove', handleMouseMove);
        el.addEventListener('mouseup', handleMouseUp);
    });

    //鼠标离开
    el.addEventListener('mouseleave', handleMouseLeave);

    //[触摸开始]
    el.addEventListener('touchstart', function handleTouchStart(event: TouchEvent) {
        event.stopPropagation();
        if(needPreventMod.includes(el.getAttribute('mod') as string)) event.preventDefault();

        const touch = event.touches[0];
        startX = touch.clientX - startX;
        startY = touch.clientY - startY;
        isDragging = true;
        el.style.cursor = 'grabbing';

        el.addEventListener('touchmove', handleTouchMove);
        el.addEventListener('touchend', handleTouchEnd);
    });

    //触摸异常中断
    el.addEventListener('touchcancel', handleTouchLeave);
}