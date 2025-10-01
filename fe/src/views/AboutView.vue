<template>
  <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">About FinanceTracker</h1>
      <p class="text-xl text-gray-600 max-w-2xl mx-auto">
        Take control of your financial future with our comprehensive personal finance management platform designed to help you budget, save, and achieve your financial goals.
      </p>
    </div>

    <div class="space-y-12">
      <section class="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <h2 class="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h2>
        <p class="text-gray-600 leading-relaxed text-lg">
          FinanceTracker empowers individuals to make informed financial decisions through intuitive tools
          and insightful analytics. We believe everyone deserves access to powerful financial management
          capabilities that were once only available to wealth managers and financial advisors. Our platform
          simplifies complex financial concepts and provides actionable insights to help you build lasting wealth.
        </p>
      </section>

      <section class="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <h2 class="text-2xl font-semibold text-gray-900 mb-6">Core Features</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="flex items-start space-x-3">
            <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
              <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
              </svg>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900">Budget Management</h3>
              <p class="text-gray-600 text-sm">Create flexible budgets and track spending across all categories</p>
            </div>
          </div>
          <div class="flex items-start space-x-3">
            <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
              <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900">Expense Tracking</h3>
              <p class="text-gray-600 text-sm">Monitor daily spending and identify patterns in your expenses</p>
            </div>
          </div>
          <div class="flex items-start space-x-3">
            <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
              <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
              </svg>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900">Income Tracking</h3>
              <p class="text-gray-600 text-sm">Record all income sources and track earnings over time</p>
            </div>
          </div>
          <div class="flex items-start space-x-3">
            <div class="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
              <svg class="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
              </svg>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900">Financial Goals</h3>
              <p class="text-gray-600 text-sm">Set savings targets and track progress toward your dreams</p>
            </div>
          </div>
          <div class="flex items-start space-x-3">
            <div class="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
              <svg class="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900">Reports & Analytics</h3>
              <p class="text-gray-600 text-sm">Visualize your financial health with detailed charts and insights</p>
            </div>
          </div>
          <div class="flex items-start space-x-3">
            <div class="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
              <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900">Bank Integration</h3>
              <p class="text-gray-600 text-sm">Securely connect your accounts for automatic transaction import</p>
            </div>
          </div>
        </div>
      </section>

      <section class="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <h2 class="text-2xl font-semibold text-gray-900 mb-6">Why Choose FinanceTracker</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="border border-gray-200 rounded-lg p-6">
            <div class="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
              </svg>
            </div>
            <h3 class="font-semibold text-gray-900 mb-2">Smart Budgeting</h3>
            <p class="text-gray-600 text-sm">AI-powered recommendations help you create realistic budgets based on your spending patterns and financial goals.</p>
          </div>
          <div class="border border-gray-200 rounded-lg p-6">
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
              </svg>
            </div>
            <h3 class="font-semibold text-gray-900 mb-2">Real-time Insights</h3>
            <p class="text-gray-600 text-sm">Get instant updates on your financial health with live dashboards and personalized recommendations.</p>
          </div>
          <div class="border border-gray-200 rounded-lg p-6">
            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </div>
            <h3 class="font-semibold text-gray-900 mb-2">Secure & Private</h3>
            <p class="text-gray-600 text-sm">Bank-level encryption protects your data while maintaining complete privacy of your financial information.</p>
          </div>
          <div class="border border-gray-200 rounded-lg p-6">
            <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
              </svg>
            </div>
            <h3 class="font-semibold text-gray-900 mb-2">Goal Achievement</h3>
            <p class="text-gray-600 text-sm">Track progress toward your financial dreams with milestone celebrations and actionable next steps.</p>
          </div>
        </div>
      </section>

      <section class="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <h2 class="text-2xl font-semibold text-gray-900 mb-6">Getting Started</h2>
        <div class="space-y-4">
          <div class="flex items-start space-x-4">
            <div class="flex-shrink-0 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">1</div>
            <div>
              <h3 class="font-semibold text-gray-900 mb-1">Create Your Free Account</h3>
              <p class="text-gray-600 text-sm">Sign up in seconds with just your email address. No credit card required.</p>
            </div>
          </div>
          <div class="flex items-start space-x-4">
            <div class="flex-shrink-0 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">2</div>
            <div>
              <h3 class="font-semibold text-gray-900 mb-1">Connect Your Accounts</h3>
              <p class="text-gray-600 text-sm">Securely link your bank accounts and credit cards for automatic transaction import.</p>
            </div>
          </div>
          <div class="flex items-start space-x-4">
            <div class="flex-shrink-0 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">3</div>
            <div>
              <h3 class="font-semibold text-gray-900 mb-1">Set Up Your First Budget</h3>
              <p class="text-gray-600 text-sm">Create personalized budgets for different spending categories and financial goals.</p>
            </div>
          </div>
          <div class="flex items-start space-x-4">
            <div class="flex-shrink-0 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">4</div>
            <div>
              <h3 class="font-semibold text-gray-900 mb-1">Start Tracking & Saving</h3>
              <p class="text-gray-600 text-sm">Monitor your progress and receive personalized insights to optimize your finances.</p>
            </div>
          </div>
        </div>

        <div class="mt-8 text-center">
          <p class="text-gray-600 mb-4">Ready to take control of your finances?</p>
          <RouterLink
            to="/"
            class="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors inline-block"
          >
            Start Your Free Trial
          </RouterLink>
        </div>
      </section>

      <section class="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <h2 class="text-2xl font-semibold text-gray-900 mb-4">Customer Support</h2>
        <p class="text-gray-600 leading-relaxed text-lg mb-6">
          Our dedicated support team is here to help you succeed with FinanceTracker.
          We offer comprehensive documentation, video tutorials, and 24/7 customer support to ensure
          you get the most out of our platform.
        </p>
        <div class="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
          <p class="text-indigo-800 font-medium">Need assistance?</p>
          <p class="text-indigo-700 text-sm">Contact us at support@financetracker.com or visit our help center.</p>
        </div>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>