<template>
  <main class="max-w-4xl mx-auto p-8">
    <h1 class="text-4xl font-bold text-gray-900 mb-8">About This Project</h1>

    <div class="space-y-6">
      <section>
        <h2 class="text-2xl font-semibold text-gray-800 mb-4">Overview</h2>
        <p class="text-gray-600 leading-relaxed">
          This is a modern Vue 3 application built with TypeScript, featuring a clean architecture
          and powerful tools for building scalable web applications. The project demonstrates best
          practices in frontend development using the latest technologies.
        </p>
      </section>

      <section>
        <h2 class="text-2xl font-semibold text-gray-800 mb-4">Tech Stack</h2>
        <ul class="list-disc list-inside text-gray-600 space-y-2">
          <li><strong>Vue 3</strong> - Progressive JavaScript framework with Composition API</li>
          <li><strong>TypeScript</strong> - Type-safe development experience</li>
          <li><strong>Vue Router</strong> - Official routing library for single-page applications</li>
          <li><strong>Pinia</strong> - Modern state management for Vue applications</li>
          <li><strong>Tailwind CSS</strong> - Utility-first CSS framework for rapid UI development</li>
          <li><strong>Vite</strong> - Fast build tool and development server</li>
        </ul>
      </section>

      <section>
        <h2 class="text-2xl font-semibold text-gray-800 mb-4">Features</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-blue-50 p-4 rounded-lg">
            <h3 class="font-semibold text-blue-900 mb-2">Modern Development</h3>
            <p class="text-blue-700 text-sm">Built with the latest Vue 3 features and TypeScript for enhanced developer experience.</p>
          </div>
          <div class="bg-green-50 p-4 rounded-lg">
            <h3 class="font-semibold text-green-900 mb-2">Fast Build Times</h3>
            <p class="text-green-700 text-sm">Powered by Vite for lightning-fast hot module replacement and builds.</p>
          </div>
          <div class="bg-purple-50 p-4 rounded-lg">
            <h3 class="font-semibold text-purple-900 mb-2">Responsive Design</h3>
            <p class="text-purple-700 text-sm">Tailwind CSS ensures beautiful, responsive layouts across all devices.</p>
          </div>
          <div class="bg-yellow-50 p-4 rounded-lg">
            <h3 class="font-semibold text-yellow-900 mb-2">State Management</h3>
            <p class="text-yellow-700 text-sm">Pinia provides intuitive and powerful state management capabilities.</p>
          </div>
        </div>
      </section>

      <section>
        <h2 class="text-2xl font-semibold text-gray-800 mb-4">Getting Started</h2>
        <div class="bg-gray-50 p-4 rounded-lg">
          <pre class="text-sm text-gray-700">
npm install
npm run dev</pre>
        </div>
      </section>
    </div>
  </main>
</template>
