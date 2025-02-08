
$(document).ready(function () {
    let menuData = {};
    let currentLanguage = "EN"; // 默认语言
    let cart = new Set(); // 用 Set 存储选中的菜单项，避免重复添加
    let userInfo = { date: "", time: "", note: "", name: "" }; // 记录用户输入信息

    // 获取菜单数据
    function loadMenuData() {
        $.getJSON("menu.json", function (data) {
            menuData = data;
            displayMenu();
        }).fail(() => console.error("Error loading menu.json"));
    }

    // 显示菜单
    function displayMenu() {
        $("#menu-items").empty();

        Object.keys(menuData).forEach(category => {
            let categoryTitle = "";
            if (category === "protein_entree") categoryTitle = "Protein Entree";
            if (category === "carb_entree") categoryTitle = "Carb Entree";
            if (category === "soup") categoryTitle = "Soup";

            $("#menu-items").append(`<h2 class="menu-category">${categoryTitle}</h2>`);

            Object.keys(menuData[category]).forEach(subCategory => {
                $("#menu-items").append();

                menuData[category][subCategory].forEach((item, index) => {
                    const itemId = category + "-" + subCategory + "-" + index;

                    $("#menu-items").append(`
                        <div class="menu-item" data-id="${itemId}">
                            <div class="textPt">
                                <h3>${currentLanguage === "EN" ? item.name : item.cname}</h3>
                                <p>${currentLanguage === "EN" ? item.ingredients : item.cingredients}</p>
                            </div>
                            <button class="toggle-cart" data-id="${itemId}">+</button>
                        </div>
                    `);
                });

                $("#menu-items").append(`<div class="menu-divider">`);
            });
        });

        updateCartButtons();
    }

    // 语言切换
    $(".language-toggle").click(function () {
        $(".language-toggle").removeClass("active");
        $(this).addClass("active");
        currentLanguage = $(this).attr("id") === "language-en" ? "EN" : "ZH";
        displayMenu();
    });

    // 添加/移除菜单项到购物车
    $(document).on("click", ".toggle-cart", function () {
        const itemId = $(this).attr("data-id");

        if (cart.has(itemId)) {
            cart.delete(itemId);
        } else {
            cart.add(itemId);
        }

        updateCartButtons();
        updateCartCount();
    });

    function updateCartButtons() {
        $(".toggle-cart").each(function () {
            const itemId = $(this).attr("data-id");
    
            if (cart.has(itemId)) {
                $(this).text("−").addClass("filled-button").removeClass("border-button");
            } else {
                $(this).text("+").addClass("border-button").removeClass("filled-button");
            }
        });
    }    

    function updateCartCount() {
        $("#cart-count").text(cart.size);
    }

    // "View Menu" 按钮点击，渐变进入新页面
    $("#view-cart").click(function () {
        $("body").css("transition", "background-color 0.5s ease");
        $("body").css("background-color", "#4F401A");

        setTimeout(() => {
            $("#menu-section").hide();
            $("#order-summary").fadeIn(600);
            loadOrderSummary();
        }, 600);
    });

    // 返回菜单界面
    $("#back-to-menu, #back-to-menu2").click(function () {
        $("#order-summary").fadeOut(400);
        setTimeout(() => {
            $("body").css("background-color", "#4F401A"); // 恢复原始背景色
        $("#menu-section").fadeIn(400);
        }, 400);
    });

    // 加载订单页面内容
    function loadOrderSummary() {
        $("#selected-menu-items").empty();
        cart.forEach(itemId => {
            $("#selected-menu-items").append(`
                <div class="menu-item" data-id="${itemId}">
                    <h3>${itemId}</h3>
                    <button class="remove-from-cart" data-id="${itemId}">−</button>
                </div>
            `);
        });

        $("#date-input").val(userInfo.date);
        $("#time-input").val(userInfo.time);
        $("#note-input").val(userInfo.note);
        $("#name-input").val(userInfo.name);
    }

    // 监听用户输入，记录数据
    $(".user-input").on("input", function () {
        let key = $(this).attr("id").replace("-input", "");
        userInfo[key] = $(this).val();
    });

    // 监听减号按钮，移除菜单项
    $(document).on("click", ".remove-from-cart", function () {
        const itemId = $(this).attr("data-id");
        cart.delete(itemId);
        loadOrderSummary();
        updateCartCount();
    });

    loadMenuData();
});