import React, { useState } from 'react';
import { FileDown, AlertCircle } from 'lucide-react';

export default function BlogFormatter() {
  const [blogContent, setBlogContent] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const generateFileName = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-') + '.php';
  };

  const extractTitle = (content) => {
    const lines = content.trim().split('\n');
    return lines[0].trim();
  };

  const formatBlogContent = (content) => {
    const lines = content.trim().split('\n');
    let html = '';
    let inList = false;
    let title = '';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (!line) {
        if (inList) {
          html += '</ul>\n';
          inList = false;
        }
        continue;
      }

      // First line is title
      if (i === 0) {
        title = line;
        html += `<h3 class="first-h3">${line}</h3>\n`;
        html += `<div style="display: block; padding: 20px;"><img src="images/xxx.webp" alt="Drizgas Blog"></div>\n`;
        continue;
      }

      // Check for bullet points or numbered lists
      if (line.match(/^[\-\*\•]\s+/) || line.match(/^\d+[\.\)]\s+/)) {
        if (!inList) {
          html += '<ul class="list">\n';
          inList = true;
        }
        const listItem = line.replace(/^[\-\*\•]\s+/, '').replace(/^\d+[\.\)]\s+/, '');
        html += `<li>${listItem}</li>\n`;
      } else {
        if (inList) {
          html += '</ul>\n';
          inList = false;
        }

        // Check if it's a heading (all caps or ends with colon, or short and bold-looking)
        if (line.length < 100 && (line === line.toUpperCase() || line.endsWith(':') || line.match(/^[A-Z][^.!?]*$/))) {
          const cleanHeading = line.replace(/:$/, '');
          html += `<h5>${cleanHeading}</h5>\n`;
        } else {
          html += `<p>${line}</p>\n`;
        }
      }
    }

    if (inList) {
      html += '</ul>\n';
    }

    return { html, title };
  };

  const generateMetaTags = (title, content) => {
    const description = content.slice(0, 160).replace(/\n/g, ' ').trim() + '...';
    const keywords = title.split(' ')
      .filter(word => word.length > 3)
      .slice(0, 8)
      .join(', ') + ', Drizgas';
    
    const imageName = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-') + '.webp';

    return `<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>${title}</title>
    <meta name="title" content="${title}">
    <meta name="description" content="${description}">
    <meta name="keywords" content="${keywords}">
    <meta name="robots" content="index, follow">

    <meta name="language" content="English">
    <meta name="author" content="Drizgas Pvt Ltd">

    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:image" content="/blogs/images/${imageName}">

    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${description}">
    <meta name="twitter:image" content="/blogs/images/${imageName}">

    <!-- Stylesheets -->
    <link href="../css/bootstrap.css" rel="stylesheet">
    <link href="../css/style.css" rel="stylesheet">
    <link href="../css/responsive.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;300;400;500;600;700;800;900&display=swap" rel="stylesheet">

    <!-- Use root path so favicon works everywhere -->
    <link rel="icon" href="/images/re-logo.png" type="image/x-icon">
</head>`;
  };

  const generatePHPFile = () => {
    if (!blogContent.trim()) {
      setError('Please paste your blog content first');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      const { html, title } = formatBlogContent(blogContent);
      const headContent = generateMetaTags(title, blogContent);
      const fileName = generateFileName(title);

      const fullHTML = `<!DOCTYPE html>
<html lang="en">

${headContent}

<body>
    <?php include_once "../header.php" ?>

    <div class="sidebar-page-container x">
        <div class="pattern-layer" style="background-image:url(../images/background/pattern-25.png)"></div>
        <div class="auto-container">
            <div class="row clearfix">
                <!-- Content Side -->
                <div class="content-side right-sidebar col-lg-12 col-md-12 col-sm-12">
                    <div class="service-detail">
                        <div class="inner-box">
                            <div class="lower-content">

<!-- BLOG CONTENT START -->

${html}
<!-- BLOG CONTENT END -->

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <?php include_once "../fotter.php" ?>

    <!-- Scripts -->
    <script src="../js/jquery.js"></script>
    <script src="../js/popper.min.js"></script>
    <script src="../js/bootstrap.min.js"></script>
    <script src="../js/jquery.mCustomScrollbar.concat.min.js"></script>
    <script src="../js/magnific-popup.min.js"></script>
    <script src="../js/appear.js"></script>
    <script src="../js/parallax.min.js"></script>
    <script src="../js/tilt.jquery.min.js"></script>
    <script src="../js/jquery.paroller.min.js"></script>
    <script src="../js/owl.js"></script>
    <script src="../js/wow.js"></script>
    <script src="../js/odometer.js"></script>
    <script src="../js/backToTop.js"></script>
    <script src="../js/jquery-ui.js"></script>
    <script src="../js/script.js"></script>
</body>
 
</html>`;

      // Create blob and download
      const blob = new Blob([fullHTML], { type: 'application/x-php' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setIsProcessing(false);
    } catch (err) {
      setError('Error generating file: ' + err.message);
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Blog Post Formatter
            </h1>
            <p className="text-gray-600">
              Paste your blog content below and generate a ready-to-publish PHP file
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
              <AlertCircle className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
              <span className="text-red-700">{error}</span>
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Blog Content
            </label>
            <textarea
              value={blogContent}
              onChange={(e) => setBlogContent(e.target.value)}
              placeholder="Paste your blog content here...&#10;&#10;First line will be the title&#10;Use - or * for bullet points&#10;Short lines or lines ending with : will become headings"
              className="w-full h-96 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm"
            />
            <p className="mt-2 text-sm text-gray-500">
              Tip: First line is the title. Use bullet points (-) for lists. Short lines become headings.
            </p>
          </div>

          <button
            onClick={generatePHPFile}
            disabled={isProcessing || !blogContent.trim()}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-4 px-6 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            <FileDown className="w-5 h-5 mr-2" />
            {isProcessing ? 'Generating...' : 'Generate & Download PHP File'}
          </button>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">
              Format Guidelines:
            </h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• First line becomes the H3 title</li>
              <li>• Use - or * for bullet points (converted to lists)</li>
              <li>• Short lines or lines ending with : become H5 headings</li>
              <li>• Regular lines become paragraphs</li>
              <li>• File name is auto-generated from title</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}