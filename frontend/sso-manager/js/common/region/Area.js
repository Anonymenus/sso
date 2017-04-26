
function initComplexArea(a, k, h, p, q, d, b, l) {
    var f = initComplexArea.arguments;
    var m = document.getElementById(a);
    var o = document.getElementById(k);
    var n = document.getElementById(h);
    var e = 0;
    var c = 0;
    var x = 0;
    if (p != undefined) {
        if (d != undefined) {
            d = parseInt(d);
        }
        else {
            d = 0;
        }
        if (b != undefined) {
            b = parseInt(b);
        }
        else {
            b = 0;
        }
        if (l != undefined) {
            l = parseInt(l);
        }
        else {
            l = 0
        }

        var t = sub_arrs[b];
        if(l == 0){
            n.options.length=0;
            n[0] = new Option("请选择 ", 0);
        }
        if(b == 0){
            o.options.length=0;
            o[0] = new Option("请选择 ", 0);
        }
        if(t){
            // console.log(n);
            for(var i=b*100; i<t.length;i++){
                if(!t[i]) continue;
                n[x] = new Option(t[i],i);
                if(i == l){
                    n[x].selected = true;
                }
                x++;
            }
        }



        for (e = 0; e < p.length; e++) {
            if (p[e] == undefined) {
                continue;
            }
            if (f[6]) {
                if (f[6] == true) {
                    if (e == 0) {
                        continue
                    }
                }
            }
            m[c] = new Option(p[e], e);
            if (d == e) {
                m[c].selected = true;
            }
            c++
        }
        if (q[d] != undefined) {
            c = 0; for (e = 0; e < q[d].length; e++) {
                if (q[d][e] == undefined) { continue }
                if (f[6]) {
                    if ((f[6] == true) && (d != 71) && (d != 81) && (d != 82)) {
                        if ((e % 100) == 0) { continue }
                    }
                } o[c] = new Option(q[d][e], e);
                if (b == e) { o[c].selected = true } c++
            }
        }
    }
}
function changeComplexProvince(f, k, e, d) {
    var c = changeComplexProvince.arguments; var h = document.getElementById(e);
    var g = document.getElementById(d); var b = 0; var a = 0; removeOptions(h); f = parseInt(f);
    if (k[f] != undefined) {

        for (b = 0; b < k[f].length; b++) {
            if (k[f][b] == undefined) { continue }
            if (c[3]) { if ((c[3] == true) && (f != 71) && (f != 81) && (f != 82)) { if ((b % 100) == 0) { continue } } }
            h[a] = new Option(k[f][b], b); a++
        }
    }
    removeOptions(g); g[0] = new Option("请选择 ", 0);
    if (f == 11 || f == 12 || f == 31 || f == 71 || f == 50 || f == 81 || f == 82) {
        if ($("#" + d + "_div"))
        { $("#" + d + "_div").hide(); }
    }
    else {
        if ($("#" + d + "_div")) { $("#" + d + "_div").show(); }
    }
}



function changeCity(c, a, t) {
    $("#" + a).html('<option value="0" >请选择</option>');
    $("#" + a).unbind("change");
    c = parseInt(c);
    var _d = sub_arrs[c];
    var str = "";
    str += "<option value='0' >请选择</option>";
	if(_d){
		for (var i = c * 100; i < _d.length; i++) {
			if (_d[i] == undefined) continue;
			str += "<option value='" + i + "' >" + _d[i] + "</option>";
		}
	}

    $("#" + a).html(str);

}

function removeOptions(c) {
    if ((c != undefined) && (c.options != undefined)) {
        var a = c.options.length;
        for (var b = 0; b < a; b++) {
            c.options[0] = null;
        }
    }
}
/**
$.regionId = function(a,b,c){
	var area = 0;
	if($("#seachdistrict").val() != "0"){
		area = $("#seachdistrict").val();
	}else if ($("#seachcity").val() != "0"){
		area = $("#seachcity").val();
	}else{
		area = $("#seachprov").val();
	}
	return area;
}**/

$.regionId = function(a,b,c){
    var area = 0;
    if($("#"+c).val() != "0"){
        area = $("#"+c).val();
    }else if ($("#"+b).val() != "0"){
        area = $("#"+b).val();
    }else{
        area = $("#"+a).val();
    }
    return area;
}


$.regionName =function(a,b,c){
	var areaID  = 0;
	if($("#"+c).val() != "0"){
		areaID = $("#"+c).val();
	}else if ($("#"+b).val() != "0"){
		areaID = $("#"+a).val();
	}else{
		areaID = $("#"+b).val();
	}
	var areaName = "";
	if(areaID.length == 2){
		areaName = area_array[areaID];
	}else if(areaID.length == 4){
		var index1 = areaID.substring(0, 2);
		//areaName = area_array[index1] + " " + sub_array[index1][areaID];
        areaName = sub_array[index1][areaID];
	}else if(areaID.length == 6){
		var index1 = areaID.substring(0, 2);
		var index2 = areaID.substring(0, 4);
		//areaName = area_array[index1] + " " + sub_array[index1][index2] + " " + sub_arrs[index2][areaID];
        areaName =  sub_arrs[index2][areaID];
	}
	return areaName;



}


