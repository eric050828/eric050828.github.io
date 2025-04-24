// 初始化AOS動畫庫
AOS.init({
  duration: 800,
  once: true,
  offset: 120
});

// 頁首背景 - 電路效果
document.addEventListener("DOMContentLoaded", function () {
  const canvas = document.getElementById('circuit-signal');
  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const paths = [];
  const numPaths = 20;

  for (let i = 0; i < numPaths; i++) {
    const path = {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      dx: (Math.random() - 0.5) * 2,
      dy: (Math.random() - 0.5) * 2,
      radius: 2 + Math.random() * 2,
      life: Math.random() * 100
    };
    paths.push(path);
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let path of paths) {
      ctx.beginPath();
      const grad = ctx.createRadialGradient(path.x, path.y, 0, path.x, path.y, path.radius * 4);
      grad.addColorStop(0, 'rgba(14,239,255,0.8)');
      grad.addColorStop(1, 'rgba(14,239,255,0)');
      ctx.fillStyle = grad;
      ctx.arc(path.x, path.y, path.radius, 0, Math.PI * 2);
      ctx.fill();

      path.x += path.dx;
      path.y += path.dy;
      path.life -= 1;

      if (path.life < 0 || path.x < 0 || path.x > canvas.width || path.y < 0 || path.y > canvas.height) {
        path.x = Math.random() * canvas.width;
        path.y = Math.random() * canvas.height;
        path.dx = (Math.random() - 0.5) * 2;
        path.dy = (Math.random() - 0.5) * 2;
        path.life = 80 + Math.random() * 40;
      }
    }
    requestAnimationFrame(animate);
  }

  animate();
});

document.addEventListener("DOMContentLoaded", () => {
  const path = document.getElementById("circuitPath");
  const dot = document.getElementById("signalDot");

  const pathLength = path.getTotalLength();
  dot.setAttribute("r", 6);

  function animateDot(timestamp) {
    const duration = 3000; // 3秒循環
    const progress = (timestamp % duration) / duration;

    const point = path.getPointAtLength(progress * pathLength);
    dot.setAttribute("cx", point.x);
    dot.setAttribute("cy", point.y);

    requestAnimationFrame(animateDot);
  }

  requestAnimationFrame(animateDot);
});

// 頁面背景 - 神經網路效果
function initBackground() {
  const container = document.getElementById('canvas-background');
  container.innerHTML = ''; // 清空之前的內容

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0f3460); // 設置背景顏色

  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // 限制像素比以提高性能
  container.appendChild(renderer.domElement);

  // 神經網路節點 - 分層結構以創造深度效果
  const neuralNodeCount = 100;
  const neuralNodes = new THREE.Group();
  const layers = 4; // 設置4層神經網路
  const layerDepth = 300; // 每層之間的深度間隔

  for (let i = 0; i < neuralNodeCount; i++) {
    const layer = Math.floor(Math.random() * layers); // 隨機分配到某一層
    // 根據層次調整大小，前面層較大，後面層較小
    const size = (layers - layer) * 3 + Math.random() * 5 + 5; // 大小從5到20
    const geometry = new THREE.SphereGeometry(size, 8, 8);
    const material = new THREE.MeshBasicMaterial({
      color: 0x808080, // 灰白色
      transparent: true,
      opacity: 0.7
    });
    const node = new THREE.Mesh(geometry, material);

    // 擴大覆蓋範圍，避免擁擠，並根據層次調整深度
    const x = (Math.random() - 0.5) * 1200;
    const y = (Math.random() - 0.5) * 1200;
    const z = (Math.random() - 0.5) * 300 + layer * layerDepth - layers * layerDepth / 2;
    node.position.set(x, y, z);

    neuralNodes.add(node);
  }

  scene.add(neuralNodes);

  // 神經網路連接線 - 減少數量並限制在相鄰層之間
  const neuralEdgeCount = 100; // 減少連接線數量
  const neuralEdges = new THREE.Group();

  const nodes = neuralNodes.children;
  for (let i = 0; i < neuralEdgeCount; i++) {
    const node1 = nodes[Math.floor(Math.random() * nodes.length)];
    const node2 = nodes[Math.floor(Math.random() * nodes.length)];

    // 限制連接線在相鄰層之間以創造層次感
    const layer1 = Math.floor((node1.position.z + layers * layerDepth / 2) / layerDepth);
    const layer2 = Math.floor((node2.position.z + layers * layerDepth / 2) / layerDepth);

    if (node1 !== node2 && Math.abs(layer1 - layer2) <= 1) {
      const curve = new THREE.LineCurve3(
        node1.position,
        node2.position
      );
      const geometry = new THREE.TubeGeometry(curve, 1, 1, 4, false);
      const material = new THREE.MeshBasicMaterial({
        color: 0x808080, // 灰白色
        transparent: true,
        opacity: 0.2
      });
      const edge = new THREE.Mesh(geometry, material);
      neuralEdges.add(edge);
    }
  }

  scene.add(neuralEdges);

  // 發光粒子效果 - 模擬神經元訊號傳輸
  const particleCount = 30;
  const particles = new THREE.Group();
  const particlePaths = [];

  for (let i = 0; i < particleCount; i++) {
    const geometry = new THREE.SphereGeometry(3, 8, 8);
    const material = new THREE.MeshBasicMaterial({
      color: 0xFFFFFF, // 白色發光效果
      transparent: true,
      opacity: 0.9
    });
    const particle = new THREE.Mesh(geometry, material);

    // 隨機選擇起始和終點神經元
    const startNode = nodes[Math.floor(Math.random() * nodes.length)];
    let endNode = nodes[Math.floor(Math.random() * nodes.length)];
    while (endNode === startNode) {
      endNode = nodes[Math.floor(Math.random() * nodes.length)];
    }

    particle.position.copy(startNode.position);
    particles.add(particle);

    // 儲存路徑信息
    particlePaths.push({
      particle: particle,
      start: startNode.position.clone(),
      end: endNode.position.clone(),
      progress: 0,
      speed: Math.random() * 0.02 + 0.01 // 速度從0.01到0.03
    });
  }

  scene.add(particles);

  camera.position.z = 800;
  camera.lookAt(0, 0, 0);

  // 動畫循環
  function animateBackground() {
    requestAnimationFrame(animateBackground);

    // 簡單的旋轉動畫
    neuralNodes.rotation.x += 0.0003;
    neuralNodes.rotation.y += 0.0005;
    neuralEdges.rotation.x += 0.0003;
    neuralEdges.rotation.y += 0.0005;

    // 脈動效果
    const time = Date.now() * 0.005;
    nodes.forEach(node => {
      node.material.opacity = 0.6 + Math.sin(time * 0.1) * 0.3;
    });

    // 粒子移動動畫 - 模擬訊號傳輸
    /* particlePaths.forEach(path => {
        path.progress += path.speed;
        
        if (path.progress >= 1) {
            path.progress = 0;
            path.start.copy(path.end);
            
            // 選擇新的終點
            const nodes = neuralNodes.children;
            let newEnd = nodes[Math.floor(Math.random() * nodes.length)];
            while (newEnd.position.distanceTo(path.start) < 100) {
                newEnd = nodes[Math.floor(Math.random() * nodes.length)];
            }
            path.end.copy(newEnd.position);
        }
        
        // 線性插值計算粒子位置
        const x = path.start.x + (path.end.x - path.start.x) * path.progress;
        const y = path.start.y + (path.end.y - path.start.y) * path.progress;
        const z = path.start.z + (path.end.z - path.start.z) * path.progress;
        path.particle.position.set(x, y, z);
        
        // 粒子發光效果
        path.particle.material.opacity = 0.7 + Math.sin(time * 0.3) * 0.3;
    }); */

    renderer.render(scene, camera);
  }

  animateBackground();

  // 調整窗口大小
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}
// 滾動觸發動畫
document.addEventListener('DOMContentLoaded', () => {
  initBackground();

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
  });

  const projectObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        anime({
          targets: entry.target,
          rotateY: [180, 0],
          scale: [0.8, 1],
          opacity: [0, 1],
          duration: 1000,
          easing: 'spring(1, 80, 10, 0)'
        });
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.project-card').forEach((el, i) => {
    el.dataset.direction = i % 2 ? 'right' : 'left';
    projectObserver.observe(el);
  });

  const educationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.education-item').forEach((el) => {
    educationObserver.observe(el);
  });

  // 技能條動畫
  document.querySelectorAll('.skill-bar-container').forEach(bar => {
    const width = bar.parentElement.querySelector('.skill-bar').style.width;
    bar.style.setProperty('--skill-level', width);
  });

  const cloudContainer = document.getElementById('tech-cloud');
  const cloudData = [
    { text: 'LLM', size: 50, color: '#0ef' },
    { text: 'Fine-tuning', size: 35, color: '#0ef' },
    { text: 'PromptEngineering', size: 35, color: '#0ef' },
    { text: 'RAG', size: 40, color: '#0ef' },
    { text: 'GraphRAG', size: 40, color: '#0ef' },
    { text: 'MCP', size: 40, color: '#0ef' },
    { text: 'AgenticAI', size: 40, color: '#0ef' },
    { text: 'Multi-Agent', size: 35, color: '#0ef' },
    { text: 'ComputerVision', size: 45, color: '#0ef' },
    { text: 'ML', size: 50, color: '#0ef' },
    { text: 'DL', size: 50, color: '#0ef' },
    { text: 'RL', size: 50, color: '#0ef' },
    { text: 'GenerativeAI', size: 50, color: '#0ef' },
    { text: 'WorkflowAutomation', size: 30, color: '#0ef' },
    { text: 'VibeCoding', size: 15, color: '#0ef' },
  ];

  // 使用TagCloud.js創建3D球形文字雲
  var tagCloud = TagCloud('#tech-cloud', cloudData.map(item => item.text), {
    radius: 300,
    maxSpeed: 'fast',
    initSpeed: 'fast',
    direction: 135,
    keep: true,
    autoRotate: false // 在非互動狀態下停止移動
  });

  // 自訂文字雲效果
  const words = document.querySelectorAll('.tagcloud--item');
  words.forEach((word, index) => {
    if (cloudData[index]) {
      word.style.color = cloudData[index].color;
      word.style.fontSize = `${cloudData[index].size}px`;
    }

    // 動態調整透明度以模擬3D深度效果
    const updateDepth = () => {
      const transform = word.style.transform;
      const zValue = transform.includes('translateZ(') ? parseFloat(transform.split('translateZ(')[1]) : 0;
      const opacity = Math.max(0.3, 1 - Math.abs(zValue) / 300);
      word.style.opacity = opacity;
    };

    // 初始設置
    setTimeout(updateDepth, 100);

    // 監聽旋轉變化
    word.addEventListener('transitionend', updateDepth);
    word.addEventListener('webkitTransitionEnd', updateDepth);
  });

  // 為文字雲添加anime.js動畫
  anime({
    targets: '.word',
    opacity: [0, 1],
    translateY: [50, 0],
    delay: anime.stagger(100, { start: 500 }),
    easing: 'spring(1, 80, 10, 0)'
  });
});

// 懸浮特效
document.querySelectorAll('.skill-tag').forEach(tag => {
  tag.addEventListener('mousemove', (e) => {
    const rect = tag.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    tag.style.setProperty('--x', `${x}px`);
    tag.style.setProperty('--y', `${y}px`);
  });
});

// 標題浮入動畫
anime.timeline()
  .add({
    targets: '.profile-info h1',
    opacity: [0, 1],
    translateY: [50, 0],
    duration: 800,
    easing: 'easeOutExpo'
  })
  .add({
    targets: '.profile-info h2',
    opacity: [0, 1],
    translateY: [30, 0],
    duration: 800,
    easing: 'easeOutExpo'
  }, '-=400')
  .add({
    targets: '.contact-info p',
    opacity: [0, 1],
    translateX: [30, 0],
    delay: anime.stagger(100),
    duration: 600,
    easing: 'easeOutExpo'
  });

// 技能標籤交錯動畫
anime({
  targets: '.skill-tag',
  opacity: [0, 1],
  translateY: [40, 0],
  delay: anime.stagger(80, { start: 1000 }),
  easing: 'spring(1, 80, 10, 0)'
});

// 專案卡輪播
(function () {
  const cards = [...document.querySelectorAll('#carousel .card')];
  let center = 2;                    // 初始中心
  const total = cards.length;

  /* 位置參數 */
  const stepX = 400;                 // 水平距離
  const stepZ = 180;                 // 深度距離
  const rotY = 25;                  // 內傾角

  function layout() {
    cards.forEach((card, i) => {
      const raw = (i - center + total) % total;          // 0 ~ n-1
      const pos = raw > total / 2 ? raw - total : raw;   // -n/2 ~ n/2
      const abs = Math.abs(pos);

      /* 只呈現中間±1，其餘收納立起*/
      if (abs > 1) {
        card.style.opacity = 0;
        card.style.pointerEvents = 'none';
        card.style.transform = `
          translateX(${pos * stepX}px)
          translateZ(-${stepZ * 1.6}px)
          rotateY(${(pos > 0 ? 1 : -1) * 90}deg)
          translate(-50%,-50%)
        `;
        return;
      }

      card.style.opacity = 1 - abs * 0.25;
      card.style.pointerEvents = abs === 0 ? 'none' : 'auto';
      card.style.zIndex = 2 - abs;
      card.style.transform = `
        translateX(${pos * stepX}px)
        translateZ(-${abs * stepZ}px)
        rotateY(${pos * rotY}deg)
        translate(-50%,-50%)
      `;
      card.style.filter = `blur(${abs * 1.1}px)`;
    });
  }

  /* dir = +1 => 右卡進來 (整體向左)；-1 反之 */
  function shift(dir) {
    center = (center + dir + total) % total;
    layout();
    anime({
      targets: '#carousel', rotateY: dir > 0 ? [-35, 0] : [35, 0],
      duration: 650, easing: 'easeOutQuad'
    });
  }

  /* 點擊事件：永遠一次移動一格 */
  cards.forEach((card, i) => {
    card.addEventListener('click', () => {
      const raw = (i - center + total) % total;
      const pos = raw > total / 2 ? raw - total : raw;
      if (pos === 0) return;
      shift(pos > 0 ? +1 : -1);
    });
  });

  /* 首次排布 */
  layout();
})();

// 技能條動態填充
document.querySelectorAll('.skill-bar').forEach(bar => {
  const width = bar.style.width;
  bar.style.width = '0%';
  anime({
    targets: bar,
    width: width,
    duration: 1200,
    delay: 1400,
    easing: 'easeOutExpo'
  });
});

// 懸停互動效果
document.querySelectorAll('.skill-tag').forEach(tag => {
  tag.addEventListener('mouseover', () => {
    anime({
      targets: tag,
      scale: 1.05,
      backgroundColor: tag.style.backgroundColor.replace(')', ',0.9)'),
      duration: 300,
      easing: 'easeOutExpo'
    });
  });

  tag.addEventListener('mouseout', () => {
    anime({
      targets: tag,
      scale: 1,
      backgroundColor: tag.style.backgroundColor.replace(',0.9)', ')'),
      duration: 300,
      easing: 'easeOutExpo'
    });
  });
});