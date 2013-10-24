/*---------控制滚动图片v1(作者:SFLYQ)-----------
Options 配置对象，（用来配置控制元素的dom位置，初始化一些必要的对象或者方法）
DoIni 初始化操作（初始化元素的jq对象，以及事件绑定等）
DoMove 控制图片现在模块的移动（控制的方向又用户传入）
BindMoveItem根据dom位置，绑定这个元素为初始化选中，并显示在第一个，
例子：
//初始化
	MoveByBtn.DoIni({
		moveBoxDom: "#MoveBox", moveBoxItemsDom: "#MoveBox ul li", moveRangeBoxDom: "#RangeBox", selectItemsDom: "#MoveBox ul li", selectClass: "on", clickDoFn: function (moveItemDom) {
			BindSelBigPic(moveItemDom);
			return false;
		}
	});

    //点击操作，拓展
	function BindSelBigPic(moveItemDom) {
	    $("#MoveBox ul li span").hide();
	    $(moveItemDom).find("span").show();
	}
     //初始化绑定选中位置，（移动上去，并选中）
	 MoveByBtn.BindMoveItem($("#MoveBox ul li")[2]);
*/
var MoveByBtn = {};
MoveByBtn = {
    Options: {
        moveBoxDom: "#MoveBox",//移动块html元素的dom位置
        moveBoxItemsDom: "#MoveBox ul li",//移动项html元素的dom位置
        moveRangeBoxDom: "#RangeBox",//移动范围块html元素的dom位置
        selectItemsDom: "#MoveBox ul li",//选中项html元素的dom位置
        selectClass: "on",//选中效果类名
        clickDoFn: function () { }//点击选中项后操作（在所有操作之后）
    },
    moveItemLength: 0,//移动项的总个数
    moveWidth: 0,//每次移动的长度
    moveBoxJq: null,//移动块的JQ对象
    moveRangeBoxJq: null,//移动范围块的JQ对象
    moveBoxItemJqs: null,//移动项JQ对象集合
    selectItemsJq: null,//选中项JQ对象集合
    // 初始化操作
    DoIni: function (iniObj) {
        MoveByBtn.moveBoxJq = $(MoveByBtn.Options.moveBoxDom);
        MoveByBtn.moveRangeBoxJq = $(MoveByBtn.Options.moveRangeBoxDom);
        MoveByBtn.moveBoxItemJqs = $(MoveByBtn.Options.moveBoxItemsDom);
        MoveByBtn.selectItemsJq = $(MoveByBtn.Options.selectItemsDom);

        MoveByBtn.Options = $.extend(MoveByBtn.Options, iniObj);
        MoveByBtn.moveWidth = $(MoveByBtn.moveBoxItemJqs[0]).outerWidth(true);
        MoveByBtn.moveItemLength = MoveByBtn.moveBoxItemJqs.length;
        var getRestrictWidth = MoveByBtn.moveBoxItemJqs.length * MoveByBtn.moveWidth - MoveByBtn.moveRangeBoxJq.width();
        //初始化点击
        MoveByBtn.moveBoxItemJqs.click(function () {
            MoveByBtn.DoItemClick(this);
            return false;
        });

        //初始化范围这个的宽度
        MoveByBtn.moveBoxJq.css({ "width": MoveByBtn.moveItemLength * MoveByBtn.moveWidth + "px" });
        MoveByBtn.moveBoxJq.css({ left: "0px", position: "absolute" });
    },
    //移动操作
    DoMove: function (movePos) {
        MoveByBtn.moveBoxJq.stop(false, true);
        var getNowLeft = parseInt(MoveByBtn.moveBoxJq.css("left"), 10);
        var needMoveLeft = 0;
        MoveByBtn.DoItemSelect(movePos);
        if (movePos == "r") {
            needMoveLeft = getNowLeft - MoveByBtn.moveWidth;
            var getRestrictWidth = MoveByBtn.moveBoxItemJqs.length * MoveByBtn.moveWidth - MoveByBtn.moveRangeBoxJq.width();
            if (needMoveLeft * -1 > getRestrictWidth) return;
        } else if (movePos == "l") {
            if (getNowLeft == 0) return;
            needMoveLeft = getNowLeft + MoveByBtn.moveWidth;
        }
        MoveByBtn.moveBoxJq.stop(false, true).animate({ left: needMoveLeft + "px" }, 500, "easeOutQuint", function () { });
    },
    //根据movePos（移动方向）控制图片滚动切换的方向，并触发图片被选中的效果和点击选中图片的操作  l=left r=right
    DoItemSelect: function (movePos) {
        var nowSelJq = $(MoveByBtn.Options.moveBoxItemsDom + "[NowSelect='1']");
        if (!nowSelJq[0]) return;
        var getSelNum = MoveByBtn.moveBoxItemJqs.index(nowSelJq);
        var needSelNum = 0;
        if (movePos == "l") {
            needSelNum = getSelNum - 1;
        } else if (movePos == "r") {
            needSelNum = getSelNum + 1;
        }
        //选中效果
        if (MoveByBtn.DoSelectEff(needSelNum)) {
            //选中后调用点击操作
            MoveByBtn.DoItemClick(MoveByBtn.moveBoxItemJqs.eq(needSelNum)[0]);
        }
        return;
    },
    //被选中的效果
    DoSelectEff: function (needSelNum) {
        if (needSelNum >= MoveByBtn.moveItemLength || needSelNum < 0) return false;//如果被选中的 位置数不存在就直接跳出
        MoveByBtn.selectItemsJq.filter("." + MoveByBtn.Options.selectClass).removeClass(MoveByBtn.Options.selectClass);
        var selItemJq = MoveByBtn.selectItemsJq.eq(needSelNum);
        if (!selItemJq[0]) return false;
        MoveByBtn.moveBoxItemJqs.attr({ "NowSelect": "2" });
        MoveByBtn.moveBoxItemJqs.eq(needSelNum).attr({ "NowSelect": "1" });
        MoveByBtn.selectItemsJq.eq(needSelNum).addClass(MoveByBtn.Options.selectClass);
        return true;
    },
    //点击操作，（添加选中的效果，并判断是否触发外部传入的点击操作，这个操作在所有操作之后）
    DoItemClick: function (moveItemDom) {
        var getIndex = MoveByBtn.moveBoxItemJqs.index(moveItemDom);//被选中的位置
        if (getIndex >= MoveByBtn.moveItemLength || getIndex < 0) return;//如果被选中的 位置数不存在就直接跳出
        MoveByBtn.DoSelectEff(getIndex);
        //用户配置了 Options 的点击操作的配置就执行
        if (MoveByBtn.Options.clickDoFn) MoveByBtn.Options.clickDoFn(moveItemDom);
    },
    //根据dom位置，绑定这个元素为初始化选中，并显示在第一个，
    BindMoveItem: function (bingItemDom) {
        if (!$(bingItemDom)[0]) return;
        var getNum = MoveByBtn.moveBoxItemJqs.index($(bingItemDom));//元素在集合中所对应的位置数
        var needMoveLeft = getNum * MoveByBtn.moveWidth * (-1);
        var getRestrictWidth = MoveByBtn.moveBoxItemJqs.length * MoveByBtn.moveWidth - MoveByBtn.moveRangeBoxJq.width();
        MoveByBtn.DoItemClick(bingItemDom);
        MoveByBtn.DoSelectEff(getNum);
        if (needMoveLeft * -1 > getRestrictWidth) { MoveByBtn.moveBoxJq.css({ left: getRestrictWidth * (-1) + "px" }); return; }
        MoveByBtn.moveBoxJq.css({ left: needMoveLeft + "px" });
    }
};