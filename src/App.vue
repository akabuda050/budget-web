<template>
    <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-6">
        <div class="mx-auto space-y-6">
            <!-- Заголовок і період -->
            <div class="bg-white rounded-xl shadow-sm border">
                <button
                    @click="headerExpanded = !headerExpanded"
                    class="flex items-center justify-between w-full p-4 md:p-6 text-left hover:bg-slate-50 transition-colors rounded-xl"
                >
                    <div class="flex flex-col md:flex-row md:items-center gap-4">
                        <h1 class="text-2xl md:text-3xl font-bold text-slate-800">Бюджет-трекер</h1>
                        <div class="flex items-center gap-2" v-if="summary">
                            <span class="text-lg font-medium text-slate-600"
                                >{{ summary.fromDate }} — {{ summary.endDate }}</span
                            >
                        </div>
                        <button
                            v-if="!headerExpanded"
                            @click.stop="load()"
                            :disabled="loading"
                            class="ml-auto h-9 w-24 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                        >
                            <svg v-if="loading" class="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
                                <circle
                                    class="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    stroke-width="4"
                                ></circle>
                                <path
                                    class="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                            {{ loading ? '' : 'Оновити' }}
                        </button>
                    </div>
                    <svg
                        :class="{ 'rotate-180': headerExpanded }"
                        class="w-5 h-5 text-slate-400 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                <div v-if="headerExpanded" class="px-4 md:px-6 pb-4 md:pb-6">
                    <!-- Фільтри періоду -->
                    <div class="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3 items-end">
                        <label class="block">
                            <span class="block text-sm font-medium text-slate-700 mb-2">Початкова дата</span>
                            <input
                                type="date"
                                v-model="fromDate"
                                :max="maxDate"
                                class="w-full h-10 px-3 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors"
                            />
                        </label>
                        <label class="block">
                            <span class="block text-sm font-medium text-slate-700 mb-2">Кінцева дата</span>
                            <input
                                type="date"
                                v-model="endDate"
                                :min="fromDate"
                                class="w-full h-10 px-3 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors"
                            />
                        </label>
                        <div class="flex justify-end">
                            <button
                                @click="load()"
                                :disabled="loading"
                                class="h-10 w-24 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                            >
                                <svg v-if="loading" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                    <circle
                                        class="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        stroke-width="4"
                                    ></circle>
                                    <path
                                        class="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                                {{ loading ? '' : 'Оновити' }}
                            </button>
                        </div>
                    </div>

                    <div v-if="error" class="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700">
                        {{ error }}
                    </div>
                </div>
            </div>

            <div v-if="summary" class="space-y-6">
                <!-- Основна інформація -->
                <div class="bg-white rounded-xl shadow-sm border">
                    <button
                        @click="mainInfoExpanded = !mainInfoExpanded"
                        class="flex items-center justify-between w-full p-4 md:p-6 text-left hover:bg-slate-50 transition-colors rounded-xl"
                    >
                        <div>
                            <h2 class="text-lg font-semibold text-slate-800">Основна інформація</h2>
                            <p class="text-sm text-slate-500 mt-1">Поточний стан балансу та лімітів</p>
                        </div>
                        <svg
                            :class="{ 'rotate-180': mainInfoExpanded }"
                            class="w-5 h-5 text-slate-400 transition-transform"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    <div v-if="mainInfoExpanded" class="px-4 md:px-6 pb-4 md:pb-6">
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <!-- Поточний баланс -->
                            <div class="bg-white rounded-xl shadow-sm border p-4 hover:shadow-md transition-shadow">
                                <div class="flex items-center justify-between mb-2">
                                    <div class="text-sm font-medium text-slate-600">Залишок</div>
                                    <FontAwesomeIcon :icon="faWallet" class="text-emerald-500" />
                                </div>
                                <div class="text-2xl font-bold text-slate-800 mb-1">
                                    {{ fmt2(currentBalanceDisplay) }}
                                    <span class="text-lg font-medium text-slate-500">Kč</span>
                                </div>
                                <span
                                    v-if="editMode"
                                    class="inline-block px-2 py-0.5 text-xs font-semibold bg-amber-100 text-amber-700 rounded-full uppercase"
                                >
                                    what-if
                                </span>
                            </div>

                            <!-- Плановий денний ліміт -->
                            <div class="bg-white rounded-xl shadow-sm border p-4 hover:shadow-md transition-shadow">
                                <div class="flex items-center justify-between mb-2">
                                    <div class="text-sm font-medium text-slate-600">Плановий ліміт на завтра</div>
                                    <FontAwesomeIcon :icon="faCoins" class="text-indigo-500" />
                                </div>
                                <div class="text-2xl font-bold text-slate-800 mb-1">
                                    {{ fmt2(plannedDailyLimitDisplay) }}
                                    <span class="text-lg font-medium text-slate-500">Kč</span>
                                </div>
                                <span
                                    v-if="editMode"
                                    class="inline-block px-2 py-0.5 text-xs font-semibold bg-amber-100 text-amber-700 rounded-full uppercase"
                                >
                                    what-if
                                </span>
                            </div>

                            <!-- Днів залишилось -->
                            <div class="bg-white rounded-xl shadow-sm border p-4 hover:shadow-md transition-shadow">
                                <div class="flex items-center justify-between mb-2">
                                    <div class="text-sm font-medium text-slate-600">Днів залишилось</div>
                                    <FontAwesomeIcon :icon="faCalendarAlt" class="text-orange-500" />
                                </div>
                                <div class="text-2xl font-bold text-slate-800">
                                    {{ summary.remainingDays }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Деталі -->
                <div class="bg-white rounded-xl shadow-sm border">
                    <button
                        @click="detailsExpanded = !detailsExpanded"
                        class="flex items-center justify-between w-full p-4 md:p-6 text-left hover:bg-slate-50 transition-colors rounded-xl"
                    >
                        <div>
                            <h2 class="text-lg font-semibold text-slate-800">Детальна статистика</h2>
                            <p class="text-sm text-slate-500 mt-1">Аналітика доходів, витрат і трендів</p>
                        </div>
                        <svg
                            :class="{ 'rotate-180': detailsExpanded }"
                            class="w-5 h-5 text-slate-400 transition-transform"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    <div v-if="detailsExpanded" class="px-4 md:px-6 pb-4 md:pb-6">
                        <!-- Фінансові показники -->
                        <div class="mb-6">
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <!-- Загальний дохід періоду -->
                                <div class="bg-white rounded-xl shadow-sm border p-4 hover:shadow-md transition-shadow">
                                    <div class="flex items-center justify-between mb-2">
                                        <div class="text-sm font-medium text-slate-600">Загальний дохід періоду</div>
                                        <FontAwesomeIcon :icon="faPiggyBank" class="text-blue-600" />
                                    </div>
                                    <div class="text-2xl font-bold text-slate-800 mb-1">
                                        {{ fmt2(summary.totalIncomeInPeriod ?? 0) }}
                                        <span class="text-lg font-medium text-slate-500">Kč</span>
                                    </div>
                                </div>

                                <!-- Початковий баланс -->
                                <div class="bg-white rounded-xl shadow-sm border p-4 hover:shadow-md transition-shadow">
                                    <div class="flex items-center justify-between mb-2">
                                        <div class="text-sm font-medium text-slate-600">Початковий баланс</div>
                                        <FontAwesomeIcon :icon="faWallet" class="text-emerald-500" />
                                    </div>
                                    <div class="text-2xl font-bold text-slate-800 mb-1">
                                        {{ fmt2(summary.startingBalance ?? 0) }}
                                        <span class="text-lg font-medium text-slate-500">Kč</span>
                                    </div>
                                </div>

                                <!-- Днів в періоді -->
                                <div class="bg-white rounded-xl shadow-sm border p-4 hover:shadow-md transition-shadow">
                                    <div class="flex items-center justify-between mb-2">
                                        <div class="text-sm font-medium text-slate-600">Днів в періоді</div>
                                        <FontAwesomeIcon :icon="faCalendarAlt" class="text-orange-500" />
                                    </div>
                                    <div class="text-2xl font-bold text-slate-800">{{ summary.totalDays }}</div>
                                </div>

                                <!-- Днів із перевитратою -->
                                <div class="bg-white rounded-xl shadow-sm border p-4 hover:shadow-md transition-shadow">
                                    <div class="flex items-center justify-between mb-2">
                                        <div class="text-sm font-medium text-slate-600">Днів із перевитратою</div>
                                        <FontAwesomeIcon :icon="faExclamationTriangle" class="text-red-500" />
                                    </div>
                                    <div class="text-2xl font-bold text-slate-800">{{ details.overspendDays }}</div>
                                </div>

                                <!-- Витрати з початку періоду -->
                                <div class="bg-white rounded-xl shadow-sm border p-4 hover:shadow-md transition-shadow">
                                    <div class="flex items-center justify-between mb-2">
                                        <div class="text-sm font-medium text-slate-600">Витрати з початку періоду</div>
                                        <FontAwesomeIcon :icon="faMinus" class="text-red-500" />
                                    </div>
                                    <div class="text-2xl font-bold text-slate-800 mb-1">
                                        {{ fmt2(details.totalSpentToDate) }}
                                        <span class="text-lg font-medium text-slate-500">Kč</span>
                                    </div>
                                </div>

                                <!-- Середньоденні витрати -->
                                <div class="bg-white rounded-xl shadow-sm border p-4 hover:shadow-md transition-shadow">
                                    <div class="flex items-center justify-between mb-2">
                                        <div class="text-sm font-medium text-slate-600">Середньоденні витрати</div>
                                        <FontAwesomeIcon :icon="faMinus" class="text-red-500" />
                                    </div>
                                    <div class="text-2xl font-bold text-slate-800 mb-1">
                                        {{ fmt2(details.avgPerDayToDate) }}
                                        <span class="text-lg font-medium text-slate-500">Kč</span>
                                    </div>
                                    <div class="text-xs text-slate-500">по пройдених днях</div>
                                </div>

                                <!-- Найбільша витрата -->
                                <div class="bg-white rounded-xl shadow-sm border p-4 hover:shadow-md transition-shadow">
                                    <div class="flex items-center justify-between mb-2">
                                        <div class="text-sm font-medium text-slate-600">Найбільша витрата</div>
                                        <FontAwesomeIcon :icon="faExclamationTriangle" class="text-amber-500" />
                                    </div>
                                    <template v-if="details.biggestExpense && details.biggestExpense.value > 0">
                                        <div class="text-2xl font-bold text-slate-800 mb-1">
                                            {{ fmt2(details.biggestExpense.value) }}
                                            <span class="text-lg font-medium text-slate-500">Kč</span>
                                        </div>
                                        <div class="text-xs text-slate-500">
                                            {{ shortDate(details.biggestExpense.date) }}
                                        </div>
                                    </template>
                                    <template v-else>
                                        <div class="text-2xl font-bold text-slate-400">—</div>
                                    </template>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Календар витрат -->
                <div v-if="summary?.expenses?.length" class="bg-white rounded-xl shadow-sm border">
                    <div class="p-4 md:p-6 border-b border-slate-200">
                        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h2 class="text-lg font-semibold text-slate-800">Денний календар витрат</h2>
                                <p class="text-sm text-slate-500 mt-1">
                                    Планування та аналіз витрат по днях
                                    <span
                                        v-if="editMode"
                                        class="ml-2 inline-block px-2 py-0.5 rounded-full text-xs font-semibold uppercase bg-amber-100 text-amber-700"
                                    >
                                        what-if режим
                                    </span>
                                </p>
                            </div>
                            <div class="flex items-center gap-2">
                                <button
                                    @click="editMode = !editMode"
                                    class="h-9 px-4 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-sm font-medium transition-colors"
                                >
                                    {{ editMode ? '✓ Готово' : '✏️ Редагувати' }}
                                </button>
                                <button
                                    v-if="editMode"
                                    @click="resetEdits"
                                    class="h-9 px-4 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-sm font-medium transition-colors"
                                >
                                    ↺ Скинути
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="p-4 md:p-6">
                        <!-- Легенда -->
                        <div class="flex flex-wrap items-center gap-4 mb-6 p-3 bg-slate-50 rounded-lg border">
                            <div class="flex items-center gap-2 text-xs text-slate-600">
                                <FontAwesomeIcon :icon="faCoins" class="text-indigo-500" />
                                <span class="font-medium">Денний ліміт</span>
                            </div>
                            <div class="flex items-center gap-2 text-xs text-slate-600">
                                <FontAwesomeIcon :icon="faPiggyBank" class="text-blue-600" />
                                <span class="font-medium">Дохід дня</span>
                            </div>

                            <div class="flex items-center gap-2 text-xs text-slate-600">
                                <FontAwesomeIcon :icon="faWallet" class="text-emerald-500" />
                                <span class="font-medium">Баланс дня</span>
                            </div>
                        </div>

                        <!-- Календарна сітка -->
                        <div
                            class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 gap-3"
                        >
                            <template v-for="(e, idx) in expensesView" :key="idx">
                                <div
                                    class="p-4 rounded-lg border bg-white hover:shadow-md transition-all duration-200"
                                    :class="{
                                        'border-indigo-300 bg-indigo-50 ring-2 ring-indigo-200': isCurrentDate(e.date),
                                        'border-emerald-300 bg-emerald-50':
                                            Number(e.saving || 0) > 0 && !isCurrentDate(e.date),
                                        'border-red-300 bg-red-50': Number(e.saving || 0) < 0,
                                        'border-slate-300': Number(e.saving || 0) === 0 && !isCurrentDate(e.date),
                                    }"
                                >
                                    <!-- Заголовок дня -->
                                    <div class="mb-3">
                                        <div class="flex items-start justify-between gap-2 mb-1">
                                            <div class="text-sm font-semibold text-slate-700">
                                                {{ shortDate(e.date) }}
                                            </div>
                                            <div
                                                v-if="isCurrentDate(e.date)"
                                                class="bg-indigo-200 text-indigo-800 px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0"
                                            >
                                                сьогодні
                                            </div>
                                        </div>
                                        <div class="text-xs text-slate-400">
                                            {{ getDaysLeftLabel(e.remainingDays) }}
                                        </div>
                                    </div>

                                    <!-- Основна сума витрат -->
                                    <div class="text-center mb-3">
                                        <div v-if="editMode">
                                            <input
                                                :value="e.value"
                                                @input="setExpenseValue(idx, $event.target.value)"
                                                class="w-full h-10 px-3 text-center text-xl font-bold rounded-lg border-2 border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors"
                                                :placeholder="fmt2(0)"
                                            />
                                        </div>
                                        <div v-else>
                                            <div
                                                class="text-2xl font-bold"
                                                :class="Number(e.value || 0) > 0 ? 'text-red-600' : 'text-slate-400'"
                                            >
                                                {{ fmt2(e.value || 0) }} Kč
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Статус економії -->
                                    <div class="text-center mb-3">
                                        <div
                                            class="inline-flex px-2 py-1 rounded-lg text-xs font-medium w-full justify-center"
                                            :class="{
                                                'bg-emerald-100 text-emerald-700': Number(e.saving || 0) > 0,
                                                'bg-red-100 text-red-700': Number(e.saving || 0) < 0,
                                                'bg-slate-200 text-slate-600': Number(e.saving || 0) === 0,
                                            }"
                                        >
                                            <div v-if="Number(e.saving || 0) > 0" class="flex items-center gap-2">
                                                <div class="text-sm">✓</div>
                                                <div class="flex flex-col items-start">
                                                    <div>Економія</div>
                                                    <div class="font-semibold">{{ fmt2(e.saving || 0) }} Kč</div>
                                                </div>
                                            </div>
                                            <div v-else-if="Number(e.saving || 0) < 0" class="flex items-center gap-2">
                                                <div class="text-sm">⚠</div>
                                                <div class="flex flex-col items-start">
                                                    <div>Перевитрата</div>
                                                    <div class="font-semibold">
                                                        {{ fmt2(Math.abs(e.saving || 0)) }} Kč
                                                    </div>
                                                </div>
                                            </div>
                                            <div v-else class="flex items-center gap-2">
                                                <div class="text-sm">—</div>
                                                <div class="flex flex-col items-start">
                                                    <div>В межах ліміту</div>
                                                    <div class="font-semibold">
                                                        {{ fmt2(Math.abs(e.value || 0)) }} Kč
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Додаткова інформація -->
                                    <div class="text-xs text-slate-600 space-y-1 pt-3 mt-3 border-t border-slate-200">
                                        <div class="flex justify-between items-center">
                                            <FontAwesomeIcon :icon="faCoins" class="text-indigo-500" />
                                            <span class="font-medium">{{ fmt2(e.dailyLimit || 0) }} Kč</span>
                                        </div>
                                        <div class="flex justify-between items-center">
                                            <FontAwesomeIcon :icon="faPiggyBank" class="text-blue-600" />
                                            <span class="font-medium text-blue-600">{{ fmt2(e.income || 0) }} Kč</span>
                                        </div>
                                        <div class="flex justify-between items-center">
                                            <FontAwesomeIcon
                                                :icon="Number(e.balance || 0) >= 0 ? faWallet : faExclamationTriangle"
                                                :class="
                                                    Number(e.balance || 0) >= 0 ? 'text-emerald-500' : 'text-red-500'
                                                "
                                            />
                                            <span
                                                class="font-medium"
                                                :class="
                                                    Number(e.balance || 0) >= 0 ? 'text-emerald-600' : 'text-red-600'
                                                "
                                            >
                                                {{ fmt2(e.balance || 0) }} Kč
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
    faCoins,
    faWallet,
    faPiggyBank,
    faExclamationTriangle,
    faCalendarAlt,
    faMinus,
} from '@fortawesome/free-solid-svg-icons';

/* -------------------- утиліти дат та форматування -------------------- */
const pad = (n) => (n < 10 ? `0${n}` : `${n}`);
const toDateInput = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

function shortDate(iso) {
    const [y, m, d] = iso.split('-').map(Number);
    const dt = new Date(y, (m || 1) - 1, d || 1);
    return dt
        .toLocaleDateString(undefined, {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
        })
        .replace(/\./g, '');
}

function parseISODate(iso) {
    const [y, m, d] = (iso || '').split('-').map(Number);
    return new Date(y, (m || 1) - 1, d || 1, 0, 0, 0, 0); // локальна північ
}

const msPerDay = 24 * 60 * 60 * 1000;
function fmt2(v) {
    const n = Number(v || 0);
    const formatted = n.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    // Якщо результат "-0.00", замінити на "0.00"
    return formatted === '-0.00' ? '0.00' : formatted;
}

/* -------------------- стан і завантаження -------------------- */
const loading = ref(false);
const error = ref('');
const summary = ref(null);

// дефолтні дати
const defaultStart = new Date();
function addOneMonthPreserveDay(d) {
    const y = d.getFullYear();
    const m = d.getMonth();
    const day = d.getDate();
    const lastNextMonth = new Date(y, m + 2, 0);
    if (day > lastNextMonth.getDate()) return lastNextMonth;
    return new Date(y, m + 1, day - 1);
}
const defaultEnd = addOneMonthPreserveDay(defaultStart);

const todayDate = new Date();
const todayMid = new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate());

const maxDate = toDateInput(todayDate);
const clampToToday = (d) => (d > todayDate ? todayDate : d);

const fromDate = ref(toDateInput(clampToToday(defaultStart)));
const endDate = ref(toDateInput(new Date('2025-10-20')));

function isDateStr(s) {
    return typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s);
}
watch(fromDate, (v) => {
    if (!isDateStr(v) || !isDateStr(endDate.value)) return;
    if (endDate.value < v) endDate.value = v;
});
watch(endDate, (v) => {
    if (!isDateStr(v) || !isDateStr(fromDate.value)) return;
    if (v < fromDate.value) endDate.value = fromDate.value;
});

async function load() {
    loading.value = true;
    error.value = '';
    try {
        const response = await fetch('/api/summary/recalculate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                fromDate: fromDate.value,
                endDate: endDate.value,
                currency: 'CZK',
                modifications: [], // пусті модифікації = базовий розрахунок
            }),
        });

        if (!response.ok) throw new Error('Помилка завантаження зведення');
        summary.value = await response.json();
    } catch (e) {
        error.value = e.message || 'Сталася помилка';
    } finally {
        loading.value = false;
    }
}
onMounted(load);

/* -------------------- what-if редагування -------------------- */
const editMode = ref(false);
const draftExpenses = ref([]);
const detailsExpanded = ref(false);
const headerExpanded = ref(false);
const mainInfoExpanded = ref(true);
const originalSummary = ref(null); // зберігаємо оригінальний summary

// джерело для відображення: або оригінал, або чернетка
const expensesView = computed(() => {
    if (!summary.value?.expenses) return [];
    return editMode.value ? draftExpenses.value : summary.value.expenses;
});

// Перерахунок через API
async function recalcDraft() {
    if (!summary.value || !editMode.value) return;

    try {
        // Підготувати modifications з поточних змін
        const modifications = draftExpenses.value.map((e) => ({
            date: e.date,
            value: Number(e.value || 0),
        }));


        const response = await fetch('https://qp5njtfsfj.execute-api.eu-north-1.amazonaws.com/dev/api/summary/recalculate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                fromDate: summary.value.fromDate,
                endDate: summary.value.endDate,
                currency: summary.value.currency || 'CZK',
                modifications,
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to recalculate');
        }

        const result = await response.json();

        // Замінити весь summary на recalculated результат в edit mode
        if (editMode.value) {
            summary.value = { ...result };
        }

        // Оновити draftExpenses з результату
        draftExpenses.value = result.expenses.map((e) => ({ ...e }));
    } catch (err) {
        console.error('Failed to recalculate:', err);
        error.value = 'Помилка перерахунку';
    }
}

// вмикання/скидання редагування
watch(editMode, (v) => {
    if (v && summary.value?.expenses) {
        // Зберігаємо оригінальний summary при входженні в edit mode
        originalSummary.value = { ...summary.value };
        draftExpenses.value = summary.value.expenses.map((e) => ({ ...e }));
        // НЕ викликаємо recalcDraft() одразу - дані вже правильні
    } else if (!v && originalSummary.value) {
        // Відновлюємо оригінальний summary при виході з edit mode
        summary.value = { ...originalSummary.value };
        originalSummary.value = null;
    }
});
watch(summary, (s) => {
    if (editMode.value && s?.expenses && !originalSummary.value) {
        // Зберігаємо оригінальний summary тільки якщо ще не збережений
        originalSummary.value = { ...s };
        draftExpenses.value = s.expenses.map((e) => ({ ...e }));
        // Не викликаємо recalcDraft() автоматично
    }
});

function setExpenseValue(idx, val) {
    const n = Number(val);
    if (!isFinite(n)) return;
    draftExpenses.value[idx].value = n;
    recalcDraft();
}
function resetEdits() {
    if (originalSummary.value?.expenses) {
        draftExpenses.value = originalSummary.value.expenses.map((e) => ({ ...e }));
        recalcDraft();
    }
}

/* -------------------- обчислення зверху/деталі -------------------- */

// баланс у картці: використовуємо дані з API
const currentBalanceDisplay = computed(() => {
    if (!summary.value) return 0;
    return Number(summary.value.currentBalance || 0);
});

// плановий денний ліміт: використовуємо дані з API
const plannedDailyLimitDisplay = computed(() => {
    if (!summary.value) return 0;
    return Number(summary.value.dailyLimit || 0);
});

const details = computed(() => {
    const s = summary.value;
    const exp = expensesView.value;
    if (!s || !exp.length) {
        return {
            totalSpentToDate: 0,
            avgPerDayToDate: 0,
            biggestExpense: null,
            overspendDays: 0,
            currentBalance: 0,
        };
    }

    const past = exp.filter((e) => parseISODate(e.date) <= todayMid);
    const totalSpentToDate = past.reduce((acc, e) => acc + Number(e.value || 0), 0);
    const daysCount = past.length || 1;
    const avgPerDayToDate = totalSpentToDate / daysCount;

    let biggestExpense = null;
    for (const e of exp) {
        const v = Number(e.value || 0);
        if (!biggestExpense || v > biggestExpense.value) biggestExpense = { date: e.date, value: v };
    }

    const overspendDays = exp.reduce((acc, e) => acc + (Number(e.saving || 0) < 0 ? 1 : 0), 0);

    // Поточний баланс з API
    const currentBalance = Number(s.currentBalance || 0);

    return { totalSpentToDate, avgPerDayToDate, biggestExpense, overspendDays, currentBalance };
});

function isCurrentDate(iso) {
    if (!isDateStr(iso)) return false;
    const [y, m, d] = iso.split('-').map(Number);
    const dt = new Date(y, (m || 1) - 1, d || 1);
    const t = new Date();
    return dt.getFullYear() === t.getFullYear() && dt.getMonth() === t.getMonth() && dt.getDate() === t.getDate();
}

function getDaysLeftLabel(remainingDays) {
    if (remainingDays === 0) return 'останній день';
    if (remainingDays < 0) return 'минув';
    return `−${remainingDays}д`;
}
</script>
