console.log("OK");

let collectionArray = [];
let currentArray = [];
let brandArray = [];
let typesArray = [];
let errorArray = [];

ajaxCallBack("products", setArticles);
let productsArray = getItemFromLocalStorage("articles");

let articlesInCart;

window.onload = () => {
    let url = window.location.pathname;

    ajaxCallBack("meni", ispisMeni);
    korpaBroj();
    clickOpenClose("hamburger", "navMeni", "flex");
    clickOpenClose("zatvaranje", "navMeni", "none");
    clickOpenClose("emptySpace", "navMeni", "none");

    if(url == "/musicstop/" || url == "/musicstop/index.html"){
        ispisCarousel();
        $("#coverPicture").slick({
            infinite: true,
            autoplay: true,
            speed: 500,
            fade: true,
            cssEase: 'linear',
            arrows: false,
            draggable: false
        });
    }
    if(url == "/musicstop/shop.html"){
        ajaxCallBack("current", storeCurrent);
        $("#sortPrice").change(filterChange);
        $("#sortShowPerPage").change(filterChange);
        $("#searchProducts").keyup(filterChange);
        $("#rasponCene").change(filterChange);
        $(".brands").change(filterChange);
        clickOpenClose("buttonFilter", "filterShop", "flex");
        clickOpenClose("filterFlexEmptySpace", "filterShop", "none");
        clickOpenClose("zatvaranjeFilter", "filterShop", "none");
        clickOpenClose("zatvaranjeModal", "modalItem", "none");
    }
    if(url == "/musicstop/contact.html"){

        clickOpenClose("zatvaranjeSuccess", "messageSent", "none");
        let imePrezime = idUnos("fullNameMessage");
        let email = idUnos("emailMessage");
        let selectReason = idUnos("chooseMessage");
        let messageBox = idUnos("message");

        let errorBlocks = classUnos("errorContact");

        let regexFullName = /^[A-ZČĆŠĐŽ][a-zčćžđš]{2,20}\s[A-ZČĆŠĐŽ][a-zčćžđš]{2,20}$/;
        let regexEmail = /^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$/;

        $("#formaKontakt").submit((e) => {
            e.preventDefault();
            errorArray = [];
            checkRegex(regexFullName, imePrezime, 0, "Invalid name, it must contain first and last name (example: Pera Perić).", errorBlocks);
            checkRegex(regexEmail, email, 1, "Invalid email, example: name@domain.com.", errorBlocks);
            checkBoxCheck(selectReason, 2, "Please choose a reason.", errorBlocks);
            messageProvera(messageBox, 3, "Please fill in the message.", errorBlocks);

            if(errorArray.length == 0){
                localStorage.removeItem("cart");
                korpaBroj();
                $("#messageSent").css({
                    display: "flex",
                    transition: "0.5s"
                });
                $("#zatvaranjeSuccess").click(() =>{
                    idUnos("formaKontakt").submit();
                });
            }
        });

        $("#messageReset").click(() => {
            for(let e of errorBlocks){
                e.innerHTML = "";
            }
        });
        $(imePrezime).change(() => {
            checkRegex(regexFullName, imePrezime, 0, "Invalid name, it must contain first and last name (example: Pera Perić).", errorBlocks);
        });
        $(email).change(() => {
            checkRegex(regexEmail, email, 1, "Invalid email, example: name@domain.com.", errorBlocks);
        });
        $(selectReason).change(() => {
            checkBoxCheck(selectReason, 2, "Please choose a reason.", errorBlocks);
        });
    }
    if(url == "/musicstop/cart.html"){
        ispisCart();

        let imePrezime = idUnos("fullName");
        let email = idUnos("email");
        let adresa = idUnos("adress");
        let entity = document.getElementsByName("entity");

        let errorBlocks = classUnos("error");

        let regexFullName = /^[A-ZČĆŠĐŽ][a-zčćžđš]{2,20}\s[A-ZČĆŠĐŽ][a-zčćžđš]{2,20}$/;
        let regexEmail = /^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$/;
        let regexAdress = /^[A-Za-z0-9\s\/-]{5,},(\s)[0-9]{1,}$/;

        $("#formaCart").submit((e) => {
            e.preventDefault();
            errorArray = [];
            checkRegex(regexFullName, imePrezime, 0, "Invalid name, it must contain first and last name (example: Pera Perić).", errorBlocks);
            checkRegex(regexEmail, email, 1, "Invalid email, example: name@domain.com.", errorBlocks);
            checkRegex(regexAdress, adresa, 2, "Adress must contain a name of the street and a house number. example: Steet, 6 (after the comma there must be a space)", errorBlocks);
            checkRadio(entity, 3, "Please select an option.", errorBlocks);
            if(errorArray.length == 0){
                localStorage.removeItem("cart");
                korpaBroj();
                idUnos("formaCart").submit();
            }
        });

        $("#dugmeReset").click(() => {
            for(let e of errorBlocks){
                e.innerHTML = "";
            }
        });
        $(imePrezime).change(() => {
            checkRegex(regexFullName, imePrezime, 0, "Invalid name, it must contain first and last name (example: Pera Perić).", errorBlocks);
        });
        $(email).change(() => {
            checkRegex(regexEmail, email, 1, "Invalid email, example: name@domain.com.", errorBlocks);
        });
        $(adresa).change(() => {
            checkRegex(regexAdress, adresa, 2, "Adress must contain a name of the street and a house number. example: Steet, 6 (after the comma there must be a space)", errorBlocks);
        });
        $(entity).change(() => {
            checkRadio(entity, 3, "Please select an option.", errorBlocks);
        });
    }
}
// funkcije

function storeCurrent(data){
    filterBar("general");
    filterBarIspis(data, "general");
    currentArray = data;
    ajaxCallBack("types", storeTypes);
}
function storeTypes(data){
    filterBar("types");
    filterBarIspis(data, "types");
    typesArray = data;
    ajaxCallBack("collections", storeCollections);
}
function storeCollections(data){
    filterBar("collections");
    filterBarIspis(data, "collections");
    collectionArray = data;
    ajaxCallBack("brands", storeBrands);
}
function storeBrands(data){
    filterBar("brands");
    filterBarIspis(data, "brands");
    brandArray = data;
    $(".general").change(filterChange);
    $(".types").change(filterChange);
    $(".brands").change(filterChange);
    $(".collections").change(filterChange);
    filterChange();
}
function idUnos(id){
    return document.getElementById(id);
}
function classUnos(klasa){
    return document.getElementsByClassName(klasa);
}
function ajaxCallBack(f, e) {
    $.ajax({
        url: `assets/data/${f}.json`,
        method: "get",
        dataType: "json",
        success: function(result){
            e(result);
        },
        error: function(xhr){
            console.log(xhr);
        }
    });
}
function ispisMeni(data){
    let html = "";
    for(let s of data){
        html += `<li><a href="${s.href}">${s.name}</a></li>`;
    }
    $("#meniLista").html(html);
    html += `<li><a href="#">Documentation</a></li>`;
    $("#footerNav").html(html);
}
function ispisCarousel(){
    let html = "";
    for(let i = 1; i <= 3; i++){
        html += `<div class="imageModel">
                    <img src="assets/img/model${i}.jpg" alt="model${i}"/>
                </div>`;
    }
    $("#coverPicture").html(html);
}
function clickOpenClose(c, e, p){
    idUnos(c).addEventListener("click", () => {
        idUnos(e).style.display = p;
    });
}
//ispis artikla

function ispisArticle(data){
    let html = "";
    data = sortiraj(data);
    data = filterSearch(data);
    data = rasponCene(data);
    data = filterCheck(data, "brands");
    data = filterCheck(data, "collections");
    data = filterCheck(data, "types");
    data = filterCheck(data, "general");
    if(data.length == 0){
        html = `<p>No mathces found</p>`;
    }
    else{
        for(let proizvod of data){
            html += `<div class="article">
                        <div class="slikaArticle">
                            ${proveraKolekcija(proizvod.collection)}
                            <img id="${proizvod.img.alt}" src="assets/img/products/${proizvod.img.src}" alt="${proizvod.img.alt}"/>
                        </div>
                        <div class="nameArticle">
                            <h3>${proizvod.name}</h3>
                        </div>
                        <div class="price">
                            <div class="newPrice">
                                ${proizvod.price.new} <span class="dinar">RSD</span>
                            </div>
                            ${staraCena(proizvod.price.old)}
                        </div>
                    </div>`;
        }
    }
    $("#articlesShop").html(html);
    ispisModal(data);
}
function ispisCart(){
    let html =  "";
    let ukupnaCena = 0;
    if(articlesInCart != undefined && articlesInCart && articlesInCart.length != 0){
        html = "";
        console.log(articlesInCart);
        for(let c of articlesInCart){
            for(let p of productsArray){
                if(c.id == p.id){
                    html += `<div class="cartItem">
                    <div class="cartItemSlika">
                        <img src="assets/img/products/${p.img.src}" alt="${p.img.alt}">
                    </div>
                    <div class="cartItemInfo">
                        <div class="cartItemNaslov">
                            <h2>${p.name}</h2>
                        </div>
                        <div class="totalForItem">
                            <p>${p.price.new} RSD x ${c.quantity} = ${parseFloat(p.price.new) * 1000 * parseFloat(c.quantity)} RSD</p> 
                        </div>
                        <div class="cartItemQty">
                            <div class="qtyCheck">
                                <button data-id="${c.id}" class="decrementQty">Remove One</button><button data-id="${c.id}" class="incrementQty">Add One</button>
                            </div>
                            <div class="qtyCheck">
                                <button data-id="${c.id}" class="removeArticleArray">Remove All</button>
                            </div>
                        </div>
                    </div>
                    </div>`;
                    ukupnaCena += parseFloat(p.price.new) * 1000 * parseFloat(c.quantity);
                }
            }
        }
    }
    else{
        html = `<h3 class="text-center p-50">The cart is empty. You can shop by clicking <a class="orange" href="shop.html">here</a></h3>`;
    }
    idUnos("cartContent").innerHTML = html;
    idUnos("totalPrice").innerHTML = `<h3>Total price: ${ukupnaCena} RSD</h3>`;
    $('.removeArticleArray').click(ukloniIzKorpeCelo);
    $('.incrementQty').click(increQty);
    $('.decrementQty').click(decreQty);
}
function increQty(){
    let decide = $(this).data("id");
    articlesInCart = getItemFromLocalStorage("cart");
    for(let a of articlesInCart){
        if(a.id == decide){
            a.quantity++;
            break;
        }
    }
    setItemToLocalStorage("cart", articlesInCart);
    ispisCart();
}
function decreQty(){
    let decide = $(this).data("id");
    let newArray = [];
    articlesInCart = getItemFromLocalStorage("cart");
    for(let a of articlesInCart){
        if(a.id == decide){
            if(a.quantity > 1){
                a.quantity--;
            }
            else{
                continue
            }
        }
        newArray.push(a);
    }
    articlesInCart = newArray;
    setItemToLocalStorage("cart", articlesInCart);
    ispisCart();
}
function ukloniIzKorpeCelo(){
    let removeId = $(this).data("id");
    let newArray = [];
    for(let a of articlesInCart){
        if(a.id == removeId){
            continue;
        }
        newArray.push(a);
    }
    setItemToLocalStorage("cart", newArray);
    korpaBroj();
    ispisCart();
}
//ispis dodatnih stvari za artikal

function ispisModal(data){
    for(let proizvod of data){
        $(`#${proizvod.img.alt}`).click(() => {
            let html = `<div class="slikaModal">
                    <img src="assets/img/products/${proizvod.img.src}" alt="${proizvod.img.alt}"/>
                </div>
                <div class="modalText">
                    <h2 class="drugiNaslov">${proizvod.name}</h2>
                    <p>${proizvod.text}</p>
                    <div class="cene">
                        <div class="cena">
                            <p>${proizvod.price.new} RSD</p>
                        </div>
                        <div class="cena">
                            <p>${staraCena(proizvod.price.old)}</p>
                        </div>
                    </div>
                    <div class="addToCartModal">
                        <button data-id="${proizvod.id}" class="dugmeZaKart">Add To Cart</button>
                    </div>`;
            $(`#ispisModal`).html(html);
            $(`#modalItem`).css({
                display: "flex"
            });
            $(`.dugmeZaKart`).click(addToCart);
        });
    }
}
function addToCart(){
    let currentId= $(this).data("id");

    if(articlesInCart){
        if(dodatoVec()){
            $("#miniModal").show("fast");
            sakrijModal();
        }
        else{
            dodajNovi();
            korpaBroj();
        }
    }
    else{
        dodajPrvi();
        korpaBroj();
    }
    function dodajPrvi(){
        let productArray=[];
        productArray[0]={
            id:currentId,
            quantity: 1
        }
        setItemToLocalStorage('cart',productArray);
    }
    function dodatoVec(){
        return articlesInCart.filter(p=>p.id==currentId).length;
    }
    function dodajNovi(){
        let productsFromStorage = getItemFromLocalStorage("cart");
        productsFromStorage.push({
            id:currentId,
            quantity: 1
        });
        setItemToLocalStorage("cart", productsFromStorage);
    }
    function sakrijModal(){
        setTimeout(() => {
            $("#miniModal").hide("fast");
        }, 1000);
    }
}
function korpaBroj(){
    articlesInCart = getItemFromLocalStorage('cart');
    if(articlesInCart){
        if(articlesInCart.length != 0){
            $("#numberSold").html(articlesInCart.length).css({
                display: "block"
            });
        }
        else{
            $("#numberSold").css({
                display: "none"
            });
        }
    }
    else{
        $("#numberSold").css({
            display: "none"
        });
    }
}
function staraCena(p){
    let html = "";
    if(p){
        html = `<div class="oldPrice">
                    <sup><s>${p} <span class="dinar">RSD</span></s></sup> 
                </div>`;
    }
    return html;
}
function proveraKolekcija(id){
    let html = "";
    if(id != null){
        for(let provera of collectionArray){
            if(provera.id == id){
                html = `<div class="collection">
                    <img src="assets/img/collections/${provera.name}.png" alt="${provera.name}"/>
                </div>`;
            }
        }
    }
    return html;
}
function ispisVelicina(sizes){
    let html = "";
    for(let i = 0; i < sizes.length; i++){
        for(let j = 0; j < sizesArray.length; j++){
            if(sizes[i] == sizesArray[j].id && i == sizes.length - 1){
                html += `${sizesArray[j].name}`;
            }
            else if(sizes[i] == sizesArray[j].id && i != sizes.length - 1){
                html += `${sizesArray[j].name}, `;
            }
        }
    }
    return html;
}
function filterBar(id){
    let html = `<div class="sectionFilter">
                    <div class="sectionNaslov">
                        <div class="textNaslov">
                            <h3>${id}</h3>
                        </div>
                    </div>
                    <div id="${id}" class="checkboxes"></div>
                </div>`;
    idUnos(`filterShopCategories`).innerHTML += html;
}
function filterBarIspis(niz, id){
    let html = "";
    for(let p of niz){
        html += `<div class="checkboxPiece">
                    <input type="checkbox" class="${id}" name="${p.name}" id="${p.id}" value="${p.id}"/><label for="${p.name}">${p.name}</label>
                </div>`;
    }
    idUnos(`${id}`).innerHTML = html;
}
//sortiranje i filtriranje

function sortiraj(data){
    let p = $("#sortPrice").val();
    switch(p){
        case "A-Z": data.sort((a, b) =>{
            if(a.name.toLowerCase() > b.name.toLowerCase()){
                return 1;
            }
            else if(a.name.toLowerCase() < b.name.toLowerCase()){
                return -1;
            }
            return 0;
        }); break;
        case "Z-A": data.sort((a, b) =>{
            if(a.name.toLowerCase() > b.name.toLowerCase()){
                return -1;
            }
            else if(a.name.toLowerCase() < b.name.toLowerCase()){
                return 1;
            }
            return 0;
        }); break;
        case "asc": data.sort((a, b) =>{
            if(parseFloat(a.price.new) > parseFloat(b.price.new)){
                return 1;
            }
            else if(parseFloat(a.price.new) < parseFloat(b.price.new)){
                return -1;
            }
            return 0;
        }); break;
        case "desc": data.sort((a, b) =>{
            if(parseFloat(a.price.new) > parseFloat(b.price.new)){
                return -1;
            }
            else if(parseFloat(a.price.new) < parseFloat(b.price.new)){
                return 1;
            }
            return 0;
        }); break;
        default: return data;
    }
    return data;
}
function filterSearch(data) {
    let u = $("#searchProducts").val();
    return data.filter((e) => {
        if(e.name.toLowerCase().indexOf(u.trim().toLowerCase()) != -1) {
            return e;
        }
    });
}
function rasponCene(data){
    let c = $("#rasponCene").val();
    $("#priceValueRange").html(c);
    data = data.filter((e) => {
        if (parseFloat(e.price.new) <= (parseFloat(c) / 1000)) {
            return e;
        }
    });
    return data;
}
function filterChange(){
    ajaxCallBack("products", ispisArticle);
}
function setItemToLocalStorage(name, data){
    localStorage.setItem(name, JSON.stringify(data));
}
function getItemFromLocalStorage(name){
    return JSON.parse(localStorage.getItem(name));
}
function setArticles(data){
    localStorage.setItem("articles", JSON.stringify(data));
}
function filterCheck(data, klasa){
    let selected = [];
    $(`.${klasa}:checked`).each(function(){
        selected.push(parseInt($(this).val()));
    });
    console.log();
    if(selected.length != 0){
        switch(klasa){
            case "brands":
            return data.filter(x => selected.includes(x.brand));
            case "collections":
            return data.filter(x => selected.includes(x.collection));
            case "types":
            return data.filter(x => selected.includes(x.type));
            case "general":
            return data.filter(x => selected.includes(x.current));
        }
    }
    return data;
}
//provera forme

function checkRegex(regex, id, i, mess, errorBlocks){
    if (id.value == "" || !regex.test(id.value)) {                
        errorArray.push(i);
        errorBlocks[i].innerHTML = mess;
    } 
    else {
        errorBlocks[i].innerHTML = "";
    }
};
function checkRadio(id, i, mess, errorBlocks){
    let vrednostRadio;
    for(let i of id){
        if(i.checked){
            vrednostRadio = i.value;
        }
    }
    if(vrednostRadio){
        errorBlocks[i].innerHTML = "";
    }
    else{
        errorArray.push(i);
        errorBlocks[i].innerHTML = mess;
    }
};
function checkBoxCheck(id, i, mess, errorBlocks){
    if(id.value != 0){
        errorBlocks[i].innerHTML = "";
    }
    else{
        errorArray.push(i);
        errorBlocks[i].innerHTML = mess;
    }
};
function messageProvera(id, i, mess, errorBlocks){
    if(id.value != ""){
        errorBlocks[i].innerHTML = "";
    }
    else{
        errorArray.push(i);
        errorBlocks[i].innerHTML = mess;
    }
}