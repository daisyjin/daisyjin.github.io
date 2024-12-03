// 获取DOM元素
const uploadArea = document.getElementById('uploadArea');
const imageInput = document.getElementById('imageInput');
const previewContainer = document.getElementById('previewContainer');
const originalPreview = document.getElementById('originalPreview');
const compressedPreview = document.getElementById('compressedPreview');
const originalSize = document.getElementById('originalSize');
const compressedSize = document.getElementById('compressedSize');
const qualitySlider = document.getElementById('qualitySlider');
const qualityValue = document.getElementById('qualityValue');
const downloadBtn = document.getElementById('downloadBtn');

let originalImage = null;

// 上传区域点击事件
uploadArea.addEventListener('click', () => {
    imageInput.click();
});

// 拖拽上传
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#007AFF';
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.style.borderColor = '#E5E5E5';
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#E5E5E5';
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        handleImage(file);
    }
});

// 文件选择处理
imageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        handleImage(file);
    }
});

// 图片处理函数
function handleImage(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        originalImage = new Image();
        originalImage.src = e.target.result;
        originalImage.onload = () => {
            originalPreview.src = originalImage.src;
            originalSize.textContent = formatFileSize(file.size);
            previewContainer.style.display = 'block';
            compressImage();
        };
    };
    reader.readAsDataURL(file);
}

// 压缩图片
function compressImage() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = originalImage.width;
    canvas.height = originalImage.height;
    
    ctx.drawImage(originalImage, 0, 0);
    
    const quality = qualitySlider.value / 100;
    const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
    
    compressedPreview.src = compressedDataUrl;
    
    // 计算压缩后文件大小
    const base64Length = compressedDataUrl.length - 'data:image/jpeg;base64,'.length;
    const compressedBytes = base64Length * 0.75;
    compressedSize.textContent = formatFileSize(compressedBytes);
}

// 质量滑块变化事件
qualitySlider.addEventListener('input', () => {
    qualityValue.textContent = qualitySlider.value + '%';
    if (originalImage) {
        compressImage();
    }
});

// 下载按钮点击事件
downloadBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'compressed-image.jpg';
    link.href = compressedPreview.src;
    link.click();
});

// 文件大小格式化
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
