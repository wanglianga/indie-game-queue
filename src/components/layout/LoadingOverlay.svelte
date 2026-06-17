<script>
  export let visible = false;
  export let text = '加载中...';
</script>

{#if visible}
  <div class="loading-overlay">
    <div class="loading-content">
      <div class="spinner">
        <div class="spinner-ring"></div>
        <div class="spinner-ring spinner-ring-2"></div>
        <div class="spinner-ring spinner-ring-3"></div>
      </div>
      <p class="loading-text">{text}</p>
    </div>
  </div>
{/if}

<style>
  .loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .loading-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }

  .spinner {
    position: relative;
    width: 60px;
    height: 60px;
  }

  .spinner-ring {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: 3px solid transparent;
    border-top-color: #00ffff;
    border-radius: 50%;
    animation: spin 1.2s linear infinite;
  }

  .spinner-ring-2 {
    top: 10%;
    left: 10%;
    width: 80%;
    height: 80%;
    border-top-color: #ff00ff;
    animation: spin 1s linear infinite reverse;
  }

  .spinner-ring-3 {
    top: 20%;
    left: 20%;
    width: 60%;
    height: 60%;
    border-top-color: #ffff00;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .loading-text {
    color: #00ffff;
    font-size: 16px;
    margin: 0;
    text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
  }
</style>
