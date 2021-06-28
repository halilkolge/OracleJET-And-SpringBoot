/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/*
 * Your about ViewModel code goes here
 */
define(['accUtils', 'ojs/ojinputtext', "knockout", "ojs/ojbootstrap", "ojs/ojarraydataprovider", "ojs/ojbufferingdataprovider", 
"ojs/ojconverter-number", "ojs/ojconverter-datetime", "ojs/ojvalidationgroup", "ojs/ojknockout", "ojs/ojinputtext", "ojs/ojdatetimepicker",
 "ojs/ojselectcombobox", "ojs/ojcheckboxset", "ojs/ojtable", "ojs/ojbutton", "ojs/ojselectsingle", "ojs/ojformlayout", "ojs/ojlabelvalue"],
 function(accUtils,input,ko,ojbootstrap_1, ArrayDataProvider, BufferingDataProvider, ojconverter_number_1, ojconverter_datetime_1) {
  function Datatable() { 
    let tmp = [];
    $.getJSON("http://localhost:8888/datatable").
            then(function (movies) {
                $.each(movies, function () {
                    tmp.push({
                        name : this.name,
                        surname : this.surname,
                        email : this.email,
                        phone : this.phone,
                        id: this.id
                    });
                    console.log(tmp);
                });
            });
            this.deptArray = tmp;
            console.log(this.deptArray);

    //this.deptObservableArray = ko.observableArray(this.deptArray);
    this.dataprovider = new BufferingDataProvider(new ArrayDataProvider(this.deptArray, {
        keyAttributes: "id",
    }));
    this.editedData = ko.observable("");
    this.editRow = ko.observable({ rowKey: null });
    this.beforeRowEditListener = (event) => {
        this.cancelEdit = false;
        const rowContext = event.detail.rowContext;
        this.originalData = Object.assign({}, rowContext.item.data);
        this.rowData = Object.assign({}, rowContext.item.data);
    };
    // handle validation of editable components and when edit has been cancelled
    this.beforeRowEditEndListener = (event) => {
        this.editedData("");
        const detail = event.detail;
        if (!detail.cancelEdit && !this.cancelEdit) {
            if (this.hasValidationErrorInRow(document.getElementById("table"))) {
                event.preventDefault();
            }
            else {
                if (this.isRowDataUpdated()) {
                    const key = detail.rowContext.item.data.id;
                    this.submitRow(key);
                }
            }
        }
    };
    this.submitRow = (key) => {
        this.dataprovider.updateItem({
            metadata: { key: key },
            data: this.rowData,
        });
        const editItem = this.dataprovider.getSubmittableItems()[0];
        this.dataprovider.setItemStatus(editItem, "submitting");
        for (let idx = 0; idx < this.deptArray.length; idx++) {
            if (this.deptArray[idx].id ===
                editItem.item.metadata.key) {
                this.deptArray.splice(idx, 1, editItem.item.data);
                break;
            }
        }
        // Set the edit item to "submitted" if successful
        this.dataprovider.setItemStatus(editItem, "submitted");
        this.editedData(JSON.stringify(editItem.item.data));
    };
    this.isRowDataUpdated = () => {
        const propNames = Object.getOwnPropertyNames(this.rowData);
        for (let i = 0; i < propNames.length; i++) {
            if (this.rowData[propNames[i]] !== this.originalData[propNames[i]]) {
                return true;
            }
        }
        return false;
    };
    // checking for validity of editables inside a row
    // return false if one of them is considered as invalid
    this.hasValidationErrorInRow = (table) => {
        const editables = table.querySelectorAll(".editable");
        for (let i = 0; i < editables.length; i++) {
            const editable = editables.item(i);
            // Table does not currently support editables with async validators
            // so treating editable with 'pending' state as invalid
            editable.validate();
        }
        var tracker = document.getElementById("tracker");
        if (tracker.valid === "valid") {
            return false;
        }
        else {
            tracker.focusOn("@firstInvalidShown");
            return true;
        }
    };
    this.handleUpdate = (event, context) => {
        this.editRow({ rowKey: context.key });
    };

    this.handleDelete = (event, context) => {
        $.post("http://localhost:8888/delete",
        {
          id: context.key
        },
        function(data, status){
          location.reload();
        });
        return true;
    };

    this.handleDone = () => {
        $.post("http://localhost:8888/update",
        {
          id: this.rowData.id,
          name: this.rowData.name,
          surname: this.rowData.surname,
          email: this.rowData.email,
          phone: this.rowData.phone,
        },
        function(data, status){
          window.location.href ="?ojr=datatable";
        });
        return true;
    };
    this.handleCancel = () => {
        this.cancelEdit = true;
        this.editRow({ rowKey: null });
    };

      this.connected = () => {
        accUtils.announce('About page loaded.', 'assertive');
        document.title = "About";
        // Implement further logic if needed
      };

      /**
       * Optional ViewModel method invoked after the View is disconnected from the DOM.
       */
      this.disconnected = () => {
        // Implement if needed
      };

      /**
       * Optional ViewModel method invoked after transition to the new View is complete.
       * That includes any possible animation between the old and the new View.
       */
      this.transitionCompleted = () => {
        // Implement if needed
      };
    }
    /*
     * Returns an instance of the ViewModel providing one instance of the ViewModel. If needed,
     * return a constructor for the ViewModel so that the ViewModel is constructed
     * each time the view is displayed.
     */
    return Datatable;
  }
);
