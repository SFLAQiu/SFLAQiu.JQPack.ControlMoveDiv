/*---------���ƹ���ͼƬv1(����:SFLYQ)-----------
Options ���ö��󣬣��������ÿ���Ԫ�ص�domλ�ã���ʼ��һЩ��Ҫ�Ķ�����߷�����
DoIni ��ʼ����������ʼ��Ԫ�ص�jq�����Լ��¼��󶨵ȣ�
DoMove ����ͼƬ����ģ����ƶ������Ƶķ������û����룩
BindMoveItem����domλ�ã������Ԫ��Ϊ��ʼ��ѡ�У�����ʾ�ڵ�һ����
���ӣ�
//��ʼ��
	MoveByBtn.DoIni({
		moveBoxDom: "#MoveBox", moveBoxItemsDom: "#MoveBox ul li", moveRangeBoxDom: "#RangeBox", selectItemsDom: "#MoveBox ul li", selectClass: "on", clickDoFn: function (moveItemDom) {
			BindSelBigPic(moveItemDom);
			return false;
		}
	});

    //�����������չ
	function BindSelBigPic(moveItemDom) {
	    $("#MoveBox ul li span").hide();
	    $(moveItemDom).find("span").show();
	}
     //��ʼ����ѡ��λ�ã����ƶ���ȥ����ѡ�У�
	 MoveByBtn.BindMoveItem($("#MoveBox ul li")[2]);
*/
var MoveByBtn = {};
MoveByBtn = {
    Options: {
        moveBoxDom: "#MoveBox",//�ƶ���htmlԪ�ص�domλ��
        moveBoxItemsDom: "#MoveBox ul li",//�ƶ���htmlԪ�ص�domλ��
        moveRangeBoxDom: "#RangeBox",//�ƶ���Χ��htmlԪ�ص�domλ��
        selectItemsDom: "#MoveBox ul li",//ѡ����htmlԪ�ص�domλ��
        selectClass: "on",//ѡ��Ч������
        clickDoFn: function () { }//���ѡ���������������в���֮��
    },
    moveItemLength: 0,//�ƶ�����ܸ���
    moveWidth: 0,//ÿ���ƶ��ĳ���
    moveBoxJq: null,//�ƶ����JQ����
    moveRangeBoxJq: null,//�ƶ���Χ���JQ����
    moveBoxItemJqs: null,//�ƶ���JQ���󼯺�
    selectItemsJq: null,//ѡ����JQ���󼯺�
    // ��ʼ������
    DoIni: function (iniObj) {
        MoveByBtn.moveBoxJq = $(MoveByBtn.Options.moveBoxDom);
        MoveByBtn.moveRangeBoxJq = $(MoveByBtn.Options.moveRangeBoxDom);
        MoveByBtn.moveBoxItemJqs = $(MoveByBtn.Options.moveBoxItemsDom);
        MoveByBtn.selectItemsJq = $(MoveByBtn.Options.selectItemsDom);

        MoveByBtn.Options = $.extend(MoveByBtn.Options, iniObj);
        MoveByBtn.moveWidth = $(MoveByBtn.moveBoxItemJqs[0]).outerWidth(true);
        MoveByBtn.moveItemLength = MoveByBtn.moveBoxItemJqs.length;
        var getRestrictWidth = MoveByBtn.moveBoxItemJqs.length * MoveByBtn.moveWidth - MoveByBtn.moveRangeBoxJq.width();
        //��ʼ�����
        MoveByBtn.moveBoxItemJqs.click(function () {
            MoveByBtn.DoItemClick(this);
            return false;
        });

        //��ʼ����Χ����Ŀ��
        MoveByBtn.moveBoxJq.css({ "width": MoveByBtn.moveItemLength * MoveByBtn.moveWidth + "px" });
        MoveByBtn.moveBoxJq.css({ left: "0px", position: "absolute" });
    },
    //�ƶ�����
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
    //����movePos���ƶ����򣩿���ͼƬ�����л��ķ��򣬲�����ͼƬ��ѡ�е�Ч���͵��ѡ��ͼƬ�Ĳ���  l=left r=right
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
        //ѡ��Ч��
        if (MoveByBtn.DoSelectEff(needSelNum)) {
            //ѡ�к���õ������
            MoveByBtn.DoItemClick(MoveByBtn.moveBoxItemJqs.eq(needSelNum)[0]);
        }
        return;
    },
    //��ѡ�е�Ч��
    DoSelectEff: function (needSelNum) {
        if (needSelNum >= MoveByBtn.moveItemLength || needSelNum < 0) return false;//�����ѡ�е� λ���������ھ�ֱ������
        MoveByBtn.selectItemsJq.filter("." + MoveByBtn.Options.selectClass).removeClass(MoveByBtn.Options.selectClass);
        var selItemJq = MoveByBtn.selectItemsJq.eq(needSelNum);
        if (!selItemJq[0]) return false;
        MoveByBtn.moveBoxItemJqs.attr({ "NowSelect": "2" });
        MoveByBtn.moveBoxItemJqs.eq(needSelNum).attr({ "NowSelect": "1" });
        MoveByBtn.selectItemsJq.eq(needSelNum).addClass(MoveByBtn.Options.selectClass);
        return true;
    },
    //��������������ѡ�е�Ч�������ж��Ƿ񴥷��ⲿ����ĵ��������������������в���֮��
    DoItemClick: function (moveItemDom) {
        var getIndex = MoveByBtn.moveBoxItemJqs.index(moveItemDom);//��ѡ�е�λ��
        if (getIndex >= MoveByBtn.moveItemLength || getIndex < 0) return;//�����ѡ�е� λ���������ھ�ֱ������
        MoveByBtn.DoSelectEff(getIndex);
        //�û������� Options �ĵ�����������þ�ִ��
        if (MoveByBtn.Options.clickDoFn) MoveByBtn.Options.clickDoFn(moveItemDom);
    },
    //����domλ�ã������Ԫ��Ϊ��ʼ��ѡ�У�����ʾ�ڵ�һ����
    BindMoveItem: function (bingItemDom) {
        if (!$(bingItemDom)[0]) return;
        var getNum = MoveByBtn.moveBoxItemJqs.index($(bingItemDom));//Ԫ���ڼ���������Ӧ��λ����
        var needMoveLeft = getNum * MoveByBtn.moveWidth * (-1);
        var getRestrictWidth = MoveByBtn.moveBoxItemJqs.length * MoveByBtn.moveWidth - MoveByBtn.moveRangeBoxJq.width();
        MoveByBtn.DoItemClick(bingItemDom);
        MoveByBtn.DoSelectEff(getNum);
        if (needMoveLeft * -1 > getRestrictWidth) { MoveByBtn.moveBoxJq.css({ left: getRestrictWidth * (-1) + "px" }); return; }
        MoveByBtn.moveBoxJq.css({ left: needMoveLeft + "px" });
    }
};