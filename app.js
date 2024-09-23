//! ----------- ToDo App -----------

// * Selector'leri tanımlama
const addInput = document.getElementById("add_input");
const addButton = document.getElementById("add_button");
const ul = document.getElementById("ul");

const countToDo = document.querySelector(".count_ToDo");
const countComp = document.querySelector(".count_Comp");
const reset = document.querySelector(".fa-power-off");

// localStorage.clear();

// * Verileri localstrage'de todo değişken ismiyle saklıyoruz. Bu verileri array haline getirebilmek için string JSON.parse metodu ile okuyoruz ve bunları myToDo değişkenine aktarıyoruz. İlk başta bir veri olmadığından boş array ile başlıyoruz
let myToDo = JSON.parse(localStorage.getItem("todo")) || [];
let myTotal = JSON.parse(localStorage.getItem("total")) || 0;
let myComplated = JSON.parse(localStorage.getItem("complated")) || 0;

const verileriGoster = () => {
  myToDo.forEach((item) => {
    createListElement(item);
  });
};

// * sayfa açıldığında input'u aktif hale getirme
// window.onload = function () {
//   addInput.focus();
// };

document.addEventListener("DOMContentLoaded", () => {
  myTotal = JSON.parse(localStorage.getItem("total"));
  myComplated = JSON.parse(localStorage.getItem("complated"));

  countToDo.textContent = myTotal;
  countComp.textContent = myComplated;
});

// * local'de tutulan verileri ekranda gösteriyoruz
verileriGoster();

addButton.addEventListener("click", () => {
  // * Girilen verinin başında ve sonunda olan boşlukları varsa siliyoruz
  if (addInput.value.trim() === "") {
    // alert("please enter a task");
    addInput.focus();
  } else {
    const newLi = {
      id: new Date().getTime(),
      checked: false,
      text: addInput.value.trim(),
    };
    createListElement(newLi);

    myToDo.push(newLi);
    localStorage.setItem("todo", JSON.stringify(myToDo));

    // * Veri girildikten sonra inputtaki yazılanı silme
    addInput.value = "";

    myTotal++;
    countToDo.textContent = myTotal;

    localStorage.setItem("total", JSON.stringify(myTotal));
    // localStorage.setItem("complated", JSON.stringify(myComplated));

    addInput.focus();
  }
});

reset.addEventListener("click", () => {
  myComplated = 0;
  countComp.textContent = 0;
  localStorage.setItem("complated", JSON.stringify(myComplated));
});

function createListElement(newLi) {
  // * Destruction yöntemi ile obje içerisindekileri değişken hale getirme
  const { id, checked, text } = newLi;

  // * li elementini oluşturma
  const li = document.createElement("li");

  // * li elementine id atama
  li.setAttribute("id", id);

  // * check edilmiş ise checked class'ını ekle
  // if (checked) {
  //   li.setAttribute("class", checked);
  // }
  // * short-cirruiting metodu ile
  checked && li.classList.add("checked");

  // * check ikonu elementini oluşturma ve li elementine ekleme
  const checkIcon = document.createElement("i");
  checkIcon.setAttribute("class", "fa-regular fa-circle-check special");
  li.appendChild(checkIcon);

  // * p elementi oluşturma
  const p = document.createElement("p");

  // * girilen task'ın p elementi içerisine eklenmesi için text'in bir değişkene atanması ve ve p elementine eklenmesi
  const pText = document.createTextNode(text);
  p.appendChild(pText);

  // * p nin li elementine eklenmesi
  li.appendChild(p);

  // * delete ikonu oluşturma ve li elementine ekleme
  const delIcon = document.createElement("i");
  delIcon.setAttribute("class", "fa-regular fa-square-minus");
  li.appendChild(delIcon);

  ul.appendChild(li);
}

//  ul elementinin child'larından herhangi birinde event olduğunda bunu tespit et ve gerekli işlemi yap (capturing)
ul.addEventListener("click", (e) => {
  // * uniq olan id'yi bir değişkene atıyoruz, daha sonra bununla silme işlemini yapacağız
  const id = e.target.parentElement.getAttribute("id");

  // * eğer bu event fa-circle-check class'ından geldiyse parent elementine checked class'ını yoksa ekle, varsa çıkar -> toggle
  if (e.target.classList.contains("fa-circle-check")) {
    // e.target.parentElement.classList.add("checked");
    e.target.parentElement.classList.toggle("checked");
    if (e.target.closest("li").classList.contains("checked")) {
      // * checked edilmişse yapılacaklardan düş, yapılanlara bir ekle
      myTotal--;
      myComplated++;
      countToDo.textContent = myTotal;
      countComp.textContent = myComplated;
      localStorage.setItem("total", JSON.stringify(myTotal));
      localStorage.setItem("complated", JSON.stringify(myComplated));
    } else {
      // * checked kaldırılmışsa, yapılacaklara bir ekle, yapılanlardan bir düş
      myTotal++;
      myComplated--;
      countToDo.textContent = myTotal;
      countComp.textContent = myComplated;
      localStorage.setItem("total", JSON.stringify(myTotal));
      localStorage.setItem("complated", JSON.stringify(myComplated));
    }
    // console.log(e.target.closest("li"));

    // * check'li halini local'e atıyoruz, ve listemizi güncelliyoruz,amaç sayfayı yenilediğimizde (veya uygulamaya tekrar girdiğimizde) check'li task'larımız tekrar eski haline dönmesin
    const task = myToDo.find((checkedId) => checkedId.id == id);

    // * false olan checked'i true ile güncelliyoruz
    task.checked = !task.checked;

    // * listemizi güncelliyoruz
    localStorage.setItem("todo", JSON.stringify(myToDo));

    // * eğer bu event fa-square-minus class'ından geldiyse parent elementini sil
  } else if (e.target.classList.contains("fa-square-minus")) {
    // * bu şekilde DOM'dan siliyoruz, local'de hale tutuluyor
    if (e.target.closest("li").classList.contains("checked")) {
      // * sadece sil, zaten checked edildiğinde değer güncellenmişti onu değiştirme
      e.target.parentElement.remove();
    } else {
      // * sil ve değerleri güncelle
      e.target.parentElement.remove();
      myTotal--;
      myComplated++;
      countToDo.textContent = myTotal;
      countComp.textContent = myComplated;
      localStorage.setItem("total", JSON.stringify(myTotal));
      localStorage.setItem("complated", JSON.stringify(myComplated));
    }

    // * silinen elementin id'si dışında kalanları tekrar array'imize atıyoruz. Daha sonra local'i güncelliyoruz
    myToDo = myToDo.filter((item) => item.id !== Number(id));
    localStorage.setItem("todo", JSON.stringify(myToDo));
  }
});

// * Task eklemeyi enter tuşu ile de yapma
addInput.addEventListener("keydown", (e) => {
  if (e.code === "Enter") {
    addButton.click();
  }
});
