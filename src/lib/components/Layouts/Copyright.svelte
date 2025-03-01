<script>
  // Current year for copyright
  const currentYear = new Date().getFullYear();
</script>

<footer class="w-full mt-10 mb-0 py-4 px-4 sm:px-6 bg-gray-900/40 backdrop-blur-md border-t border-purple-900/20">
  <div class="max-w-4xl mx-auto">
    <!-- Copyright and name with GitHub link -->
    <div class="flex justify-center items-center">
      <div class="text-gray-400 text-[11px] sm:text-[13px] whitespace-nowrap">
        Copyright © {currentYear} <a 
          href="https://github.com/mmycin" 
          class="text-purple-200 hover:text-purple-300 transition-colors duration-200 font-medium"
          target="_blank" 
          rel="noopener noreferrer">Tahcin Ul Karim (Mycin)</a>. All rights reserved.
      </div>
    </div>
  </div>
</footer>

<style>
  /* Custom hover effects for links */
  a {
    position: relative;
    text-decoration: none;
  }
  
  a.text-purple-200:after {
    content: '';
    position: absolute;
    width: 0;
    height: 1px;
    bottom: -1px;
    left: 0;
    background: linear-gradient(to right, rgba(192, 132, 252, 0.8), rgba(216, 180, 254, 0.8));
    transition: width 0.3s ease;
  }
  
  a.text-purple-200:hover:after {
    width: 100%;
  }
</style>