/*
 Copyright (c) 2010 Todd Wells

 This file is part of Cuanto, a test results repository and analysis program.

 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU Lesser General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU Lesser General Public License for more details.

 You should have received a copy of the GNU Lesser General Public License
 along with this program.  If not, see <http://www.gnu.org/licenses/>.

 */

YAHOO.namespace('cuanto');

YAHOO.cuanto.testCaseRename = function() {
	var findBtn;
	var replaceBtn;
	var dataTable;

	initialize();


	function initialize() {
		findBtn = new YAHOO.widget.Button("findBtn", {
			onclick: {fn: handleFind},
			disabled: true

		});

		replaceBtn = new YAHOO.widget.Button("replaceBtn", {
			onclick: {fn: handleReplace},
			disabled: true
		});

		enableFind();
		handleFormChange(null);

		$(".change").keyup(handleFormChange);
	}


	function handleFind(e) {
	    var serializedForm = $('#renameForm').find("input").serialize();
		initTable();
	}


	function handleReplace(e) {
		var eligibleRecords = $.grep(dataTable.getRecordSet().getRecords(), function (record, idx){
			return record.getData("checked");
		});

		var recordsToPost = $.map(eligibleRecords, function(record) {
			return { id: record.getData("testCase").id, newName: record.getData("newName") };
		});

		var jsonToPost = YAHOO.lang.JSON.stringify(recordsToPost);
		var bkpt;
	}


	function disableFind() {
		//$("#facet").add("#searchTerm").add("#replaceName").attr("disabled", "disabled");
		$("#searchTerm").add("#replaceName").attr("disabled", "disabled");
		findBtn.set("disabled", true);
	}


	function enableFind() {
		//$("#facet").add("#searchTerm").add("#replaceName").removeAttr("disabled");
		$("#searchTerm").add("#replaceName").removeAttr("disabled");
		findBtn.set("disabled", false);
	}
	

	function getSearchTerm() {
		return $.trim($('#searchTerm').val());
	}


	function getReplaceTerm() {
		return $.trim($("#replaceName").val());
	}


	function handleFormChange(e) {
		if (getSearchTerm() != "" && getReplaceTerm() != "") {
		    findBtn.set("disabled", false);
	    } else {
		    findBtn.set("disabled", true);
	    }
	}


	function handleSelectChange(e) {
		var record = dataTable.getRecord(e.target);
		record.setData("checked", $(this).attr("checked"));
	}

	function initTable() {
		$("#renameTable").empty();
		dataTable = new YAHOO.widget.DataTable("renameTable", getColumnDefs(), getDataSource(), getDataTableConfig());

		// todo: make this logic conditional after response is received if records are > 0. Need to know what event to subscribe to

		disableFind();
		replaceBtn.set('disabled', false);

	}


	function getColumnDefs() {
		return [
			{label: "Select", resizeable: false, formatter: formatSelect},
			{key: "testCase", label: "Current Name", resizeable: false, formatter: formatCurrentName},
			{key: "newName", label: "New Name", resizeable: false}
		];
	}


	function getDataSource() {
		var dataSource = new YAHOO.util.XHRDataSource(YAHOO.cuanto.urls.get('renamePreview'));
		dataSource.responseType = YAHOO.util.DataSource.TYPE_JSON;
		dataSource.connXhrMode = "allowAll";
		dataSource.maxCacheEntries = 0;
		dataSource.responseSchema = {
			resultsList: 'renameList',
			fields: ["testCase", "newName"]
		};
		return dataSource;
	}


	function getDataTableConfig() {
		var inputs = $('#renameForm').find("input");
		var selects = $('#renameForm').find("select");
		var serializedForm = inputs.add(selects).serialize();
		return {
			sortedBy: {key: "testCase", dir: YAHOO.widget.DataTable.CLASS_ASC},
			initialRequest: serializedForm 
		}
	}


	function formatSelect(elCell, oRecord, oColumn, oData) {
		var chk = $("<input type='checkbox' checked='true' class='chk'/>");
		$(elCell).html(chk);
		chk.change(handleSelectChange);
		oRecord.setData("checked", true);
	}

	function formatCurrentName(elCell, oRecord, oColumn, oData) {
		$(elCell).html(oData["fullName"]);
	}
};