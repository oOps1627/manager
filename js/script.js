'use strict'
var table = document.getElementById('table');
var tbody = table.getElementsByTagName('tbody')[0];

var btnEdit = document.getElementById('edit');
var btnDelete = document.getElementById('delete');
var btnAdd = document.getElementById('add');
var btnSave = document.getElementById('save');

var wrapper = document.getElementById("wrapper")

table.onclick = function(e) {
      if (e.target.tagName == 'TH') {
      	// якщо клікнули по заголовку - сортуєм
      	sortGrid(e.target.cellIndex, e.target.getAttribute('data-type'));
      } else if(e.target.tagName == 'TD') {
      	// інакше виділяєм рядок
      		selectRow(e.target.parentNode.rowIndex-1)
      } else { return }

};

		    function sortGrid(colNum, type) {

		      // масив з tr
		      var rowsArray = [].slice.call(tbody.rows);
		      // визначає тип сорування
		      var compare;

		      switch (type) {
		        case 'number':
		          compare = function(rowA, rowB) {
		            return rowA.cells[colNum].innerHTML - rowB.cells[colNum].innerHTML;
		          };
		          break;
		        case 'string':
		          compare = function(rowA, rowB) {
		            return rowA.cells[colNum].innerHTML > rowB.cells[colNum].innerHTML ? 1 : -1;
		          };
		          break;
		         case 'date':
		          compare = function(rowA, rowB) {
		          	// якщо тип сортування дата, робим із стрічок дат масив
		          	// і створюєм з масиву число, перші числа якого рік і місяць
		          	var arrA = rowA.cells[colNum].innerHTML.split(".").reverse();
		          	var arrB = rowB.cells[colNum].innerHTML.split(".").reverse();
		          	
		          	var rowA = arrA.join("");
		          	var rowB = arrB.join("");
		          	return rowA - rowB;
		          };
		          break;
		      }
		      // сортуєм масив
		      rowsArray.sort(compare);
		      // вставляємо всі елементи з масиву в потрібному порядку
		      for (var i = 0; i < rowsArray.length; i++) {
		        tbody.appendChild(rowsArray[i]);
		      }
		    }

		    function selectRow(rowNum) {
		    	tbody.children[rowNum].classList.toggle('selected');
		    	btnSwitch();
		    	function btnSwitch() {
		    		var amountSelected=0;
		    		// перевіряєм кількість виділених рядків
			    	[].forEach.call(tbody.children, function(elem) {
			    		if(elem.classList.contains('selected')) amountSelected++;
			    	});
			    	// робимо доступними кнопки в залежності від к-сті виділених рядків
			    	if (amountSelected>0) {
			    		btnDelete.removeAttribute("disabled")
			    	} else {
			    		btnDelete.setAttribute("disabled", "disabled");
			    	}
			    	if (amountSelected==1) {
			    		btnEdit.removeAttribute("disabled")
			    	} else {
			    		btnEdit.setAttribute("disabled", "disabled")
			    	}
			    	
		   		}
		    }

btnDelete.onclick = function() {
	// видаляємо виділені рядки
	for (var i = 0; i < tbody.children.length; i++) {
		var currentElem = tbody.children[i];
		if(currentElem.classList.contains('selected')) {
			tbody.removeChild(currentElem);
			i--;
		}
	}
}

btnAdd.onclick = function() {
	var newNickName = prompt("Введіть нікнейм", "");
	if (newNickName=="" || newNickName==null) {
		alert("Поле пусте");
		return
	}
	var newTr = document.createElement("tr");
	newTr.setAttribute("draggable","true");

	var currentDate = getDate();
	var currentTime = getTime();
	var currentId = getId();
		tbody.appendChild(newTr);
	// автозаповнення форми
	for(var i=0; i<4; i++) {
		var newTd = document.createElement("td");
		switch (i) {
		        case 0:
		          newTd.textContent = currentId;
		          break;
		        case 1:
		          newTd.textContent = currentDate;
		          break;
		        case 2:
		          newTd.textContent = currentTime;
		          break;
		        case 3:
		          newTd.textContent = newNickName;
		          break;
		}
		tbody.lastElementChild.appendChild(newTd);
	}
}

			// визначаєм сьогоднішню дату
			function getDate() {
			  var date = new Date();
			  var day = date.getDate();
			  if (day < 10) day = '0' + day;
			  var mounth = date.getMonth() + 1;
			  if (mounth < 10) mounth = '0' + mounth;
			  var year = date.getFullYear();
			  return day + '.' + mounth + '.' + year;
			}
			// час
			function getTime() {
				var date = new Date();
				var hour = date.getHours();
				if (hour < 10) hour = '0' + hour;
				var minute = date.getMinutes();
				if (minute < 10) minute = '0' + minute;
				return hour + ":" + minute;
			}
			// визначаєм найбільший id і збільшуєм на 1
			function getId() {
				var id=0;
				[].forEach.call(tbody.children, function(elem) {
					if (elem.firstElementChild.innerHTML>id) id=elem.firstElementChild.innerHTML;
				});
				return ++id
			}

btnEdit.onclick = function() {
	wrapper.style.display="block";
	var inputs = document.querySelectorAll("#form>input");
	var selectedTr;

	for(var i=0; i<tbody.children.length; i++) {
		if(tbody.children[i].classList.contains('selected')) {
			selectedTr=i;
			break
		}
	}
	[].forEach.call(inputs, function(input, i) {
		input.value = tbody.children[selectedTr].children[i].innerHTML
	});
		btnSave.onclick = function() {
			for(var i=0; i<4; i++) {
				tbody.children[selectedTr].children[i].innerHTML = inputs[i].value;
			}
			wrapper.style.display="none";
			return false
		}
}


		// DRAG AND DROP

var dragSrcEl = null;
function handleDragStart(e) {
  this.style.opacity = '0.8'; 

  dragSrcEl = this;

  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', this.innerHTML);
}

function handleDragOver(e) {
  if (e.preventDefault) {
    e.preventDefault();
  }

  e.dataTransfer.dropEffect = 'move';
  return false;
}

function handleDragEnter(e) {
  this.classList.add('over');
}

function handleDragLeave(e) {
  this.classList.remove('over'); 
}

function handleDrop(e) {

  if (e.stopPropagation) {
    e.stopPropagation();
  }

  if (dragSrcEl != this) {
    dragSrcEl.innerHTML = this.innerHTML;
    this.innerHTML = e.dataTransfer.getData('text/html');
  }

  return false;
}

function handleDragEnd(e) {
   dragSrcEl.style.opacity="1";
  [].forEach.call(cols, function (col) {
    col.classList.remove('over');
  });
}

var cols = document.querySelectorAll('tr');
[].forEach.call(cols, function(col) {
  col.addEventListener('dragstart', handleDragStart, false);
  col.addEventListener('dragenter', handleDragEnter, false)
  col.addEventListener('dragover', handleDragOver, false);
  col.addEventListener('dragleave', handleDragLeave, false);
  col.addEventListener('drop', handleDrop, false);
  col.addEventListener('dragend', handleDragEnd, false);
});