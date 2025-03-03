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
            let categoryTitle = currentLanguage === "EN" ? category : category; 
            $("#menu-items").append(`<h2 class="menu-category">${categoryTitle}</h2>`);

            Object.keys(menuData[category]).forEach(subCategory => {
                menuData[category][subCategory].forEach((item, index) => {
                    const itemId = `${category}-${subCategory}-${index}`;
                    $("#menu-items").append(`
                        <div class="menu-item" data-id="${itemId}">
                            <div class="textPt">
                                <h3>${currentLanguage === "EN" ? item.name : item.cname}</h3>
                                <p>${currentLanguage === "EN" ? item.ingredients : item.cingredients}</p>
                            </div>
                            <div class="button-wrapper">
                                <button class="toggle-cart" data-id="${itemId}">+</button>
                            </div>
                        </div>
                    `);
                });
                $("#menu-items").append(`<div class="menu-divider">`);
            });
        });
        updateCartButtons();
    }

    // 监听语言切换
    $(".language-toggle").click(function () {
        $(".language-toggle").removeClass("active");
        $(this).addClass("active");
        currentLanguage = $(this).attr("id") === "language-en" ? "EN" : "ZH";
        updateAllPages();
    });

    // 更新所有页面内容
    function updateAllPages() {
        displayMenu();
        updateOrderSummaryText();
        updateSelectedMenu();
        updateReceipt();
        syncLanguageButtonState();
    }

    // 更新订单页面 Summary Text
    function updateOrderSummaryText() {
        let content = currentLanguage === "EN" ?
            `<h3>Dear Valia, with trembling hands, I humbly ask for your culinary grace on
            <input type="text" id="date-input" class="user-input" placeholder="[Date]">.
            As your faithful admirer, I long to dine at
            <input type="text" id="time-input" class="user-input" placeholder="[Time]"> with you.
            Please allow me to add:
            <input type="text" id="note-input" class="user-input" placeholder="[Your Addition (Love) Note]">.
            </h3>
            <h3>Your artistry turns mere food into magic, and I await your reply with bated breath.</h3>
            <h3 style="width:100%;">Yours most humbly,<br> 
            <input type="text" id="name-input" class="user-input" placeholder="[Name]"></h3>` 
        : 
            `<h3>致亲爱的 Valia，怀着忐忑之心，我斗胆请求您在
            <input type="text" id="date-input" class="user-input" placeholder="[请填写日期]"> 这天赐予我美食之恩。
            鄙人名为
            <input type="text" id="name-input" class="user-input" placeholder="[请填写姓名]">，
            希望于
            <input type="text" id="time-input" class="user-input" placeholder="[请填写时间/午餐/晚餐]"> 共享美味。
            另附心底小语：
            <input type="text" id="note-input" class="user-input" placeholder="[请填写寄语]">。
            </h3>
            <h3>您的厨艺化凡为仙，我屏息以待您的答复。</h3>
            <h3 style="width:100%;">卑微之食客上<br> 
            <input type="text" id="name-input" class="user-input" placeholder="[您的敬仰者]"></h3>`;

        $("#order-summary-content").html(content);
    }

    // 更新已选菜单项（订单页面）
    function updateSelectedMenu() {
        $("#selected-menu-items").empty();
        cart.forEach(itemId => {
            let [category, subCategory, index] = itemId.split("-");
            let item = menuData[category]?.[subCategory]?.[index];
    
            if (item) {
                let displayName = currentLanguage === "EN" ? item.name : item.cname;
                $("#selected-menu-items").append(`
                    <div class="menu-item2">
                        <h3>${displayName}</h3>
                        <button class="remove-from-cart" data-id="${itemId}">−</button>
                    </div>
                `);
            }
        });
    }    

    // 更新收据页面
    function updateReceipt() {
        $("#receipt-user-info").empty();
        $("#receipt-menu-items").empty();
        $("#receipt-user-info").append(`
            <p>Date: ${userInfo.date || "[Not specified]"}</p>
            <p>Time: ${userInfo.time || "[Not specified]"}</p>
            <p>Note: ${userInfo.note || "[Not specified]"}</p>
            <p>Name: ${userInfo.name || "[Not specified]"}</p>
        `);
        cart.forEach(itemId => {
            let [category, subCategory, index] = itemId.split("-");
            let item = menuData[category]?.[subCategory]?.[index];
            if (item) {
                $("#receipt-menu-items").append(`<li>${item.name} (${item.cname})</li>`);
            }
        });
    }


    // 回到顶端
    function scrollToTop() {
        $("html, body").animate({ scrollTop: 0 }, "fast");
    }    

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
        $("#all-set span").text(cart.size); // 同步到 All Set 旁边的数字
    }          

    // "View Menu" 按钮点击，渐变进入新页面
    $("#view-cart").click(function () {
        $("body").css("transition", "background-color 0.5s ease");
        $("body").css("background-color", "var(--brown)");
    
        setTimeout(() => {
            $("#menu-section").hide();
            $("#order-summary").fadeIn(600);
            syncLanguageButtonState(); // 先同步语言按钮状态
            loadOrderSummary(); // 再加载订单信息
            scrollToTop();
        }, 600);
    });              

    // 返回菜单界面
    $("#back-to-menu, #back-to-menu2").click(function () {
        $("#order-summary").fadeOut(400);
        setTimeout(() => {
            $("body").css("background-color", "var(--brown)"); // 恢复原始背景色
            $("#menu-section").fadeIn(400);
            syncLanguageButtonState(); // 确保语言继承
            displayMenu(); // 先同步语言，再更新菜单
            scrollToTop();
        }, 400);
    });              

    function loadOrderSummary() {
        $("#selected-menu-items").empty();
        cart.forEach(itemId => {
            let [category, subCategory, index] = itemId.split("-");
            let item = menuData[category]?.[subCategory]?.[index];
    
            if (item) {
                let displayName = currentLanguage === "EN" ? item.name : item.cname;
                $("#selected-menu-items").append(`
                    <div class="menu-item2">
                        <h3>${displayName}</h3>
                    </div>
                `);
            }
        });
    
        // 更新 Summary Text
        updateOrderSummary();
    
        // 确保用户输入的值保持
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
        updateSelectedMenu(); // 更新页面上的已选菜单
        updateCartCount(); // 购物车数字也要更新
    });    

    loadMenuData();

    // 类别切换键
    $(document).ready(function () {
        function scrollToDivider(direction) {
            let dividers = $(".menu-divider"); // 获取所有 `.menu-divider`
            let scrollTop = $(window).scrollTop(); // 当前滚动位置
            let targetIndex = -1; // 目标 `.menu-divider` 的索引
    
            dividers.each(function (index) {
                let offsetTop = $(this).offset().top; // 获取 `.menu-divider` 的位置
                if (direction === "up" && offsetTop < scrollTop) {
                    targetIndex = index; // 记录 **当前屏幕上方** 最近的 `.menu-divider`
                }
                if (direction === "down" && offsetTop > scrollTop + 10) { // 避免小偏差
                    targetIndex = index;
                    return false; // 找到第一个后停止
                }
            });
    
            if (direction === "up") {
                if (targetIndex === -1) {
                    // **如果已经在最顶部，跳到最后一个 `.menu-divider`**
                    $("html, body").animate({ scrollTop: dividers.last().offset().top }, 500);
                } else {
                    $("html, body").animate({ scrollTop: dividers.eq(targetIndex).offset().top }, 500);
                }
            } else if (direction === "down") {
                if (targetIndex === -1) {
                    // **如果已经在最底部，跳到第一个 `.menu-divider`**
                    $("html, body").animate({ scrollTop: dividers.first().offset().top }, 500);
                } else {
                    $("html, body").animate({ scrollTop: dividers.eq(targetIndex).offset().top }, 500);
                }
            }
        }
    
        // **绑定按钮事件**
        $("#scroll-up").click(function () {
            scrollToDivider("up");
        });
    
        $("#scroll-down").click(function () {
            scrollToDivider("down");
        });
    });


    // section 3
    function loadOrderSummary() {
    $("#selected-menu-items").empty();
    let ingredientCount = {}; // 统计食材

    cart.forEach(itemId => {
        let [category, subCategory, index] = itemId.split("-");
        let item = menuData[category]?.[subCategory]?.[index];

        if (item) {
            let displayName = currentLanguage === "EN" ? item.name : item.cname;
            $("#selected-menu-items").append(`
                <div class="menu-item2">
                    <h3>${displayName}</h3>
                    <button class="remove-from-cart" data-id="${itemId}">−</button>
                </div>
            `);

            // 统计食材数量
            item.ingredients.split(", ").forEach(ingredient => {
                ingredientCount[ingredient] = (ingredientCount[ingredient] || 0) + 1;
            });
        }
    });

    // 显示合并后的食材
    $("#receipt-ingredients").empty();
    Object.entries(ingredientCount).forEach(([ingredient, count]) => {
        $("#receipt-ingredients").append(`<li>${ingredient} * ${count}</li>`);
    });

    // 显示用户信息
    $("#receipt-user-info").empty();
    Object.keys(userInfo).forEach(key => {
        $("#receipt-user-info").append(`<p>${key.charAt(0).toUpperCase() + key.slice(1)}: ${userInfo[key]}</p>`);
    });
}

    // 语言按钮同步
    function syncLanguageButtonState() {
        $(".language-toggle").removeClass("active");
        if (currentLanguage === "EN") {
            $("#language-en").addClass("active");
            $("#language-zh").removeClass("active");
        } else {
            $("#language-zh").addClass("active");
            $("#language-en").removeClass("active");
        }
    
        // 确保所有页面的语言按钮正确同步
        $(".language-toggle").each(function () {
            if ($(this).attr("id") === "language-en" && currentLanguage === "EN") {
                $(this).addClass("active");
            } else if ($(this).attr("id") === "language-zh" && currentLanguage === "ZH") {
                $(this).addClass("active");
            }
        });
    }       

    // 确保所有页面的语言文字更新
    displayMenu(); // 更新菜单页
    loadOrderSummary(); // 更新订单页
    loadReceiptSection(); // 更新收据页



    // section 3
    function loadReceiptSection() {
        console.log("Loading receipt section..."); // Debug log
    
        $("#receipt-user-info").empty();
        $("#receipt-menu-items").empty();
    
        // 确保用户信息不会为空
        $("#receipt-user-info").append(`
            <p>Date: ${userInfo.date || "[Not specified]"}</p>
            <p>Time: ${userInfo.time || "[Not specified]"}</p>
            <p>Note: ${userInfo.note || "[Not specified]"}</p>
            <p>Name: ${userInfo.name || "[Not specified]"}</p>
        `);
    
        // 确保菜品列表更新
        if (cart.size === 0) {
            $("#receipt-menu-items").append(`<li>No items selected.</li>`);
        } else {
            cart.forEach(itemId => {
                let [category, subCategory, index] = itemId.split("-");
                let item = menuData[category]?.[subCategory]?.[index];
                if (item) {
                    $("#receipt-menu-items").append(`<li>${item.name} (${item.cname})</li>`);
                }
            });
        }
    }          

    // 监听 "All Set" 按钮，切换到收据页面
    $("#all-set").off("click").on("click", function () {
        console.log("All Set clicked!"); // Debug log，确认事件触发
    
        $("#order-summary").fadeOut(400, function () { 
            $("#receipt-section").fadeIn(400).css("display", "block"); // 强制显示
            $("body").addClass("receipt-active"); // 让背景色变白
            loadReceiptSection(); // 确保收据内容更新
            syncLanguageButtonState(); // 语言状态同步
            scrollToTop();
        });
    });          

    $("#back-to-summary").click(function () {
        $("#receipt-section").fadeOut(400);
        setTimeout(() => {
            $("#order-summary").fadeIn(400);
            $("body").removeClass("receipt-active"); // 让背景色恢复
            scrollToTop();
        }, 400);
    });    

    $("#save-receipt").click(function () {
        html2canvas(document.body).then(canvas => {
            let link = document.createElement("a");
            link.download = "receipt.png";
            link.href = canvas.toDataURL("image/png");
            link.click();
        });
    });    
     
});