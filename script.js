let isWorking = false;
let earningsInterval;
let balance = 0;
let level = 1;
let isBusinessModalOpen = false; // Флаг для отслеживания состояния окна
const initialEarnings = 1; // 1 рубль за 2 секунды
const earningsTime = 2000; // 2 секунды
const jobs = [
    { name: "Работа дворником", level: 1, earnings: 1, time: 2000 },
    { name: "Работа охранником", level: 3, earnings: 3, time: 4000 },
    // Здесь можно добавить другие работы
];

const businesses = [
    { name: "Магазин", cost: 100, income: 5 },
    { name: "Ресторан", cost: 500, income: 20 },
    // Здесь можно добавить другие бизнесы
];

ymaps.ready(init);

function init() {
    const map = new ymaps.Map("map", {
        center: [55.751244, 37.618423],
        zoom: 10,
    });
    map.events.add('click', function (e) {
        const coords = e.get('coords');
        const locationName = `Вы выбрали локацию (${coords[0].toFixed(6)}, ${coords[1].toFixed(6)})`;
        document.getElementById('locationName').innerText = locationName;
        if (!isWorking && !isBusinessModalOpen) {
            isBusinessModalOpen = true; // Устанавливаем флаг
            document.getElementById('businessModal').style.display = "block";
        }
    });
}

function closeModal() {
    isBusinessModalOpen = false; // Сбрасываем флаг при закрытии окна
    document.getElementById('businessModal').style.display = "none";
}

function confirmBusiness() {
    const companyName = prompt("Введите название вашей компании:");
    if (companyName) {
        document.getElementById('companyNameDisplay').innerText = companyName;
        document.getElementById('map').style.display = "none"; // Убираем карту
        document.getElementById('companyInfo').style.display = "block"; // Показываем информацию о компании
        displayJobs(); // Отображаем доступные работы
        displayBusinesses(); // Отображаем доступные бизнесы
    }
    closeModal();
}

function displayJobs() {
    const jobsContainer = document.getElementById('jobs');
    jobsContainer.innerHTML = ""; // Очистка контейнера
    jobs.forEach(job => {
        const jobElement = document.createElement('div');
        jobElement.innerText = `${job.name} - Заработок: ${job.earnings} руб. за ${job.time / 1000} сек. (Уровень ${job.level})`;
        if (job.level > level) {
            jobElement.innerText += ` - Доступно с уровня ${job.level}`;
        } else {
            jobElement.innerHTML += ` <button onclick="startJob('${job.name}', ${job.earnings})">Работать</button>`;
        }
        jobsContainer.appendChild(jobElement);
    });
}

function displayBusinesses() {
    const businessesContainer = document.getElementById('businesses');
    businessesContainer.innerHTML = ""; // Очистка контейнера
    businesses.forEach(business => {
        const businessElement = document.createElement('div');
        businessElement.innerText = `${business.name} - Стоимость: ${business.cost} руб., Заработок: ${business.income} руб./сек.`;
        businessElement.innerHTML += ` <button onclick="buyBusiness(${business.cost}, '${business.name}')">Купить</button>`;
        businessesContainer.appendChild(businessElement);
    });
}

function toggleWork() {
    document.getElementById('businessInfo').style.display = "none"; // Скрываем бизнес
    const workInfo = document.getElementById('workInfo');
    workInfo.style.display = workInfo.style.display === "none" ? "block" : "none";
}

function toggleBusiness() {
    document.getElementById('workInfo').style.display = "none"; // Скрываем работы
    const businessInfo = document.getElementById('businessInfo');
    businessInfo.style.display = businessInfo.style.display === "none" ? "block" : "none";
}

function startJob(jobName, earnings) {
    if (isWorking) return; // Проверка, работает ли уже бизнес
    isWorking = true;
    document.getElementById('progressText').innerText = "Заработок в процессе...";
    let progress = 0;
    document.getElementById('progressBar').value = 0;
    earningsInterval = setInterval(() => {
        if (progress < 100) {
            progress += 50; // Заполнение прогресс-бара на 50% за 2 секунды
            document.getElementById('progressBar').value = progress;
            if (progress >= 100) {
                balance += earnings; // Добавляем к балансу
                document.getElementById('balance').innerText = balance;
                level = Math.floor(balance / 100) + 1; // Увеличение уровня каждые 100 рублей
                document.getElementById('level').innerText = level;
                document.getElementById('progressText').innerText = "Заработок завершен!";
                isWorking = false; // Сбрасываем статус работы
                clearInterval(earningsInterval); // Очищаем интервал
                // Отображаем кнопку, если работа завершена
            }
        }
    }, earningsTime / 2); // Обновляем прогресс каждые 1 секунду
}

function buyBusiness(cost, businessName) {
    if (balance >= cost) {
        balance -= cost; // Уменьшаем баланс на стоимость бизнеса
        document.getElementById('balance').innerText = balance;
        alert(`Вы купили ${businessName}!`);
    } else {
        alert("Недостаточно средств для покупки!");
    }
}

function openStockMarket() {
    document.getElementById('stockMarketModal').style.display = "block"; // Открываем модальное окно
    stockMarket.displayStocks(); // Вызываем функцию отображения акций
}

function closeStockMarket() {
    document.getElementById('stockMarketModal').style.display = "none"; // Закрываем модальное окно
}
class StockMarket {
    constructor() {
        this.stocks = [
            { name: "Акция A", price: 100, history: [100, 105, 110, 107, 115] }, // Добавим историю цен
            { name: "Акция B", price: 200, history: [200, 195, 205, 210, 215] }  // Добавим историю цен
        ];
    }

    displayStocks() {
        const stocksContainer = document.getElementById('stocks');
        stocksContainer.innerHTML = ""; // Очистка контейнера
        this.stocks.forEach(stock => {
            const stockElement = document.createElement('div');
            stockElement.innerText = `${stock.name} - Цена: ${stock.price} руб.`;
            stocksContainer.appendChild(stockElement);
        });
        this.renderCharts(); // Рисуем графики после отображения акций
    }

    renderCharts() {
        // График для Акции A
        const ctxA = document.getElementById('stockAChart').getContext('2d');
        new Chart(ctxA, {
            type: 'line',
            data: {
                labels: ['1', '2', '3', '4', '5'], // Метки по оси X
                datasets: [{
                    label: 'Цена Акции A',
                    data: this.stocks[0].history,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 2,
                    fill: false,
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                    }
                }
            }
        });

        // График для Акции B
        const ctxB = document.getElementById('stockBChart').getContext('2d');
        new Chart(ctxB, {
            type: 'line',
            data: {
                labels: ['1', '2', '3', '4', '5'], // Метки по оси X
                datasets: [{
                    label: 'Цена Акции B',
                    data: this.stocks[1].history,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 2,
                    fill: false,
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                    }
                }
            }
        });
    }
}
const stockMarket = new StockMarket(); // Создаем экземпляр класса StockMarket