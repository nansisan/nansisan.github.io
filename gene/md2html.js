function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

function convertMdToHtml(markdown) {
  let html = '';
  let inParagraph = false;
  let inList = false;

  markdown.split('\n').forEach(line => {
    line = line.trim();
    line = escapeHtml(line); // ここで特殊文字をエスケープ

    // ヘッダーの変換 (h1~h6)
    if (/^#{1,6}\s+.+$/.test(line)) {
      if (inParagraph) {
        html += '</p>\n';
        inParagraph = false;
      }
      const headingLevel = line.split(' ')[0].length;
      const content = line.substring(headingLevel + 1);
      html += `<h${headingLevel}>${content}</h${headingLevel}>\n`;
    }
    // 画像の変換
    else if (/!\[([^\]]+)\]\(([^\)]+)\)/.test(line)) {
      if (inParagraph) {
        html += '</p>\n';
        inParagraph = false;
      }
      html += line.replace(/!\[([^\]]+)\]\(([^\)]+)\)/g, '<img src="$2" alt="$1">\n');
    }
    // リンクの変換
    else if (/\[([^\]]+)\]\(([^\)]+)\)/.test(line)) {
      if (!inParagraph) {
        html += '</p>\n';
        inParagraph = false;
      }
      html += line.replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '<a href="$2">$1</a>\n');
    }
    // リストの変換
    else if (line.startsWith('- ')) {
      if (inParagraph) {
        html += '</p>\n';
        inParagraph = false;
      }
      if (!inList) {
        html += '<ul>\n';
        inList = true;
      }
      html += '<li>' + line.substring(2) + '</li>\n';
    }
    // 空行の処理
    else if (line === '') {
      if (inParagraph) {
        html += '</p>\n';
        inParagraph = false;
      }
      if (inList) {
        html += '</ul>\n';
        inList = false;
      }
    }
    // その他のテキスト（段落）
    else {
      if (!inParagraph) {
        html += '<p>';
        inParagraph = true;
      }
      html += line + ' ';
    }
  });

  // 最後の段落またはリストを閉じる
  if (inParagraph) {
    html += '</p>\n';
  }
  if (inList) {
    html += '</ul>\n';
  }

  return html;
}
