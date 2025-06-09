const THEMES = {
  default: { file: 'style-default.css', label: 'Default' },
  'dark-blue': { file: 'style-dark-blue.css', label: 'Dark Blue' },
};

const selectedTheme = localStorage.getItem('ts_theme') || 'dark-blue';

function injectThemeCss(themeKey) {
  const theme = THEMES[themeKey] || THEMES.default;
  const cssPath = theme.file;
  fetch(chrome.runtime.getURL(cssPath))
    .then(res => res.text())
    .then(css => {
      const style = document.createElement('style');
      style.textContent = css;
      document.head.appendChild(style);
    })
    .catch(console.error);
}

injectThemeCss(selectedTheme);


function waitForElement(selector, callback) {
  const el = document.querySelector(selector);
  if (el) {
    callback(el);
  } else {
    setTimeout(() => waitForElement(selector, callback), 100);
  }
}

waitForElement('.navbar-nav.ml-auto', navbar => {
  if (document.getElementById('themeSettingsButton')) return;

  const li = document.createElement('li');
  li.className = 'nav-item';

  const btn = document.createElement('a');
  btn.href = '#';
  btn.className = 'nav-link';
  btn.id = 'themeSettingsButton';
  btn.textContent = 'Theme Settings';
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    showThemeModal();
  });

  li.appendChild(btn);
  navbar.insertBefore(li, navbar.querySelector('li.nav-item:last-child'));
});

function createCustomDropdown(container, selectedValue, options, onSelect) {
  const dropdown = document.createElement('div');
  dropdown.className = 'custom-dropdown';
  dropdown.style.cssText = `
    position: relative;
    width: 100%;
  `;

  const trigger = document.createElement('div');
  trigger.className = 'dropdown-trigger';
  trigger.style.cssText = `
    width: 100%;
    padding: 12px 16px;
    background: hsla(221, 49.20%, 25.50%, 0.47);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 12px;
    color: white;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    backdrop-filter: blur(10px);
    outline: none;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: all 0.2s ease;
    user-select: none;
  `;

  const selectedText = document.createElement('span');
  selectedText.textContent = options.find(opt => opt.value === selectedValue)?.label || options[0].label;

  const arrow = document.createElement('span');
  arrow.innerHTML = '▼';
  arrow.style.cssText = `
    font-size: 12px;
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    opacity: 0.7;
  `;

  trigger.appendChild(selectedText);
  trigger.appendChild(arrow);

  const optionsContainer = document.createElement('div');
  optionsContainer.className = 'dropdown-options';
  optionsContainer.style.cssText = `
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: rgba(30, 30, 40, 0.95);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 12px;
    margin-top: 4px;
    backdrop-filter: blur(20px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
    z-index: 1000;
    overflow: hidden;
    opacity: 0;
    transform: translateY(-10px) scale(0.95);
    pointer-events: none;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  `;

  options.forEach((option, index) => {
    const optionEl = document.createElement('div');
    optionEl.className = 'dropdown-option';
    optionEl.textContent = option.label;
    optionEl.style.cssText = `
      padding: 12px 16px;
      color: white;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      border-bottom: ${index < options.length - 1 ? '1px solid rgba(255, 255, 255, 0.1)' : 'none'};
      opacity: 0;
      transform: translateY(-5px);
      transition-delay: ${index * 0.05}s;
    `;

    if (option.value === selectedValue) {
      optionEl.style.background = 'rgba(59, 130, 246, 0.3)';
    }

    optionEl.addEventListener('mouseenter', () => {
      if (option.value !== selectedValue) {
        optionEl.style.background = 'rgba(255, 255, 255, 0.1)';
      }
    });

    optionEl.addEventListener('mouseleave', () => {
      if (option.value !== selectedValue) {
        optionEl.style.background = 'transparent';
      }
    });

    optionEl.addEventListener('click', () => {
      selectedText.textContent = option.label;
      closeDropdown();
      onSelect(option.value);
    });

    optionsContainer.appendChild(optionEl);
  });

  let isOpen = false;

  function openDropdown() {
    if (isOpen) return;
    isOpen = true;

    arrow.style.transform = 'rotate(180deg)';
    trigger.style.borderColor = 'rgba(59, 130, 246, 0.5)';
    trigger.style.background = 'rgba(255, 255, 255, 0.25)';

    optionsContainer.style.pointerEvents = 'auto';
    optionsContainer.style.opacity = '1';
    optionsContainer.style.transform = 'translateY(0) scale(1)';

    const optionElements = optionsContainer.querySelectorAll('.dropdown-option');
    optionElements.forEach((opt, index) => {
      setTimeout(() => {
        opt.style.opacity = '1';
        opt.style.transform = 'translateY(0)';
      }, index * 30);
    });

    setTimeout(() => {
      document.addEventListener('click', outsideClickHandler);
    }, 10);
  }

  function closeDropdown() {
    if (!isOpen) return;
    isOpen = false;

    arrow.style.transform = 'rotate(0deg)';
    trigger.style.borderColor = 'rgba(255, 255, 255, 0.3)';
    trigger.style.background = 'rgba(255, 255, 255, 0.2)';

    const optionElements = optionsContainer.querySelectorAll('.dropdown-option');
    optionElements.forEach((opt, index) => {
      setTimeout(() => {
        opt.style.opacity = '0';
        opt.style.transform = 'translateY(-5px)';
      }, index * 15);
    });

    setTimeout(() => {
      optionsContainer.style.opacity = '0';
      optionsContainer.style.transform = 'translateY(-10px) scale(0.95)';
      optionsContainer.style.pointerEvents = 'none';
    }, optionElements.length * 15);

    document.removeEventListener('click', outsideClickHandler);
  }

  function outsideClickHandler(e) {
    if (!dropdown.contains(e.target)) {
      closeDropdown();
    }
  }

  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    if (isOpen) {
      closeDropdown();
    } else {
      openDropdown();
    }
  });

  dropdown.appendChild(trigger);
  dropdown.appendChild(optionsContainer);

  return dropdown;
}

function showThemeModal() {
  if (document.getElementById('themeModalOverlay')) return;

  const overlay = document.createElement('div');
  overlay.id = 'themeModalOverlay';
  overlay.style.cssText = `
    position: fixed; 
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    animation: fadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  `;

  const modal = document.createElement('div');
  modal.id = 'themeModal';
  modal.style.cssText = `
    background: hsla(221, 49.2%, 25.5%, 0.47);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 20px;
    padding: 32px;
    width: 380px;
    max-width: 90vw;
    color: #fff;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(20px);
    animation: slideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
  `;


  const headerGradient = document.createElement('div');
  headerGradient.style.cssText = `
    position: absolute; 
    top: 0; 
    left: 0; 
    right: 0; 
    height: 80px; 
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, transparent 100%); 
    border-radius: 20px 20px 0 0; 
    pointer-events: none;
  `;

  const content = document.createElement('div');
  content.style.cssText = 'position: relative; z-index: 1;';

  const header = document.createElement('div');
  header.style.cssText = 'text-align: center; margin-bottom: 28px;';
  header.innerHTML = `
    <div style="width: 48px; height: 48px; background: rgba(255, 255, 255, 0.15); border-radius: 12px; margin: 0 auto 12px; display: flex; align-items: center; justify-content: center; border: 1px solid rgba(255, 255, 255, 0.2); overflow: hidden;">
      <img src="${chrome.runtime.getURL('Icon.png')}" alt="Icon" style="width: 32px; height: 32px;" />
    </div>
    <h2 style="margin: 0; font-size: 24px; font-weight: 700; background: linear-gradient(45deg, #ffffff, #e0e7ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">Theme Settings</h2>
    <p style="margin: 4px 0 0; font-size: 14px; opacity: 0.8; font-weight: 400;">Customize your Thunderstore experience</p>
  `;

  const themeSection = document.createElement('div');
  themeSection.style.cssText = `
    background: rgba(255, 255, 255, 0.1); 
    border-radius: 16px; 
    padding: 20px; 
    border: 1px solid rgba(255, 255, 255, 0.15);
  `;

  const sectionLabel = document.createElement('div');
  sectionLabel.style.cssText = `
    font-size: 14px; 
    font-weight: 600; 
    margin-bottom: 12px; 
    display: flex; 
    align-items: center; 
    gap: 8px;
  `;
  sectionLabel.innerHTML = '<span style="font-size: 16px;">🎨</span> Theme Selection';

  let selectedThemeValue = selectedTheme;

  const dropdownOptions = Object.entries(THEMES).map(([key, data]) => ({
    value: key,
    label: data.label
  }));

  const dropdown = createCustomDropdown(
    themeSection,
    selectedTheme,
    dropdownOptions,
    (value) => {
      selectedThemeValue = value;
    }
  );


  themeSection.appendChild(sectionLabel);
  themeSection.appendChild(dropdown);

  const buttons = document.createElement('div');
  buttons.style.cssText = 'display: flex; gap: 12px; margin-top: 28px;';

  const cancelBtn = document.createElement('button');
  cancelBtn.id = 'cancelThemeBtn';
  cancelBtn.textContent = 'Cancel';
  cancelBtn.style.cssText = `
    background: rgba(255, 255, 255, 0.1); 
    color: white; 
    border: 1px solid rgba(255, 255, 255, 0.2); 
    border-radius: 12px; 
    padding: 12px 20px; 
    flex: 1; 
    cursor: pointer; 
    font-size: 14px; 
    font-weight: 600;
    transition: all 0.2s ease;
  `;

  const confirmBtn = document.createElement('button');
  confirmBtn.id = 'confirmThemeBtn';
  confirmBtn.textContent = 'Apply & Refresh';
  confirmBtn.style.cssText = `
    background: linear-gradient(135deg, #3b82f6, #1d4ed8); 
    color: white; 
    border: none; 
    border-radius: 12px; 
    padding: 12px 20px; 
    flex: 2; 
    cursor: pointer; 
    font-size: 14px; 
    font-weight: 600; 
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    transition: all 0.2s ease;
  `;

  const footer = document.createElement('div');
  footer.textContent = 'Made by @atomictyler - MIT License';
  footer.style.cssText = 'text-align: center; font-size: 12px; opacity: 0.6; margin-top: 16px;';

  cancelBtn.addEventListener('mouseenter', () => {
    cancelBtn.style.background = 'rgba(255, 255, 255, 0.15)';
    cancelBtn.style.transform = 'translateY(-1px)';
  });

  cancelBtn.addEventListener('mouseleave', () => {
    cancelBtn.style.background = 'rgba(255, 255, 255, 0.1)';
    cancelBtn.style.transform = 'translateY(0)';
  });

  confirmBtn.addEventListener('mouseenter', () => {
    confirmBtn.style.transform = 'translateY(-1px)';
    confirmBtn.style.boxShadow = '0 6px 16px rgba(59, 130, 246, 0.4)';
  });

  confirmBtn.addEventListener('mouseleave', () => {
    confirmBtn.style.transform = 'translateY(0)';
    confirmBtn.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
  });

  buttons.appendChild(cancelBtn);
  buttons.appendChild(confirmBtn);

  content.appendChild(header);
  content.appendChild(themeSection);
  content.appendChild(buttons);

  modal.appendChild(headerGradient);
  modal.appendChild(content);
  modal.appendChild(footer);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  

  overlay.addEventListener('click', e => {
    if (e.target === overlay) {
      overlay.style.animation = 'fadeOut 0.2s ease-out forwards';
      setTimeout(() => overlay.remove(), 200);
    }
  });

  cancelBtn.addEventListener('click', () => {
    overlay.style.animation = 'fadeOut 0.2s ease-out forwards';
    setTimeout(() => overlay.remove(), 200);
  });

  confirmBtn.addEventListener('click', () => {
    localStorage.setItem('ts_theme', selectedThemeValue);
    location.reload();
  });

  if (!document.getElementById('themeModalAnimStyles')) {
    const animStyles = document.createElement('style');
    animStyles.id = 'themeModalAnimStyles';
    animStyles.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
      }
      @keyframes slideIn {
        from { transform: translateY(-30px) scale(0.95); opacity: 0; }
        to { transform: translateY(0) scale(1); opacity: 1; }
      }
    `;
    document.head.appendChild(animStyles);
  }
}