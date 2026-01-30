const renderClassic = (data) => {
  const { personal, experience, education, skills } = data;

  const iconStyle = "vertical-align: text-bottom; margin-right: 4px;";
  const icons = {
    email: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="${iconStyle}"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`,
    phone: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="${iconStyle}"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
    location: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="${iconStyle}"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Helvetica', 'Arial', sans-serif; line-height: 1.5; color: #333; margin: 40px; }
        h1 { text-transform: uppercase; font-size: 24px; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 5px; }
        .header { margin-bottom: 20px; }
        .header-info { font-size: 14px; margin-top: 5px; display: flex; flex-wrap: wrap; gap: 15px; align-items: center; color: #666; }
        .header-item { display: flex; align-items: center; white-space: nowrap; }
        h2 { text-transform: uppercase; font-size: 16px; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-top: 20px; margin-bottom: 10px; }
        .section { margin-bottom: 20px; }
        .item { margin-bottom: 15px; }
        .item-header { display: flex; justify-content: space-between; align-items: baseline; }
        .company { font-weight: bold; font-size: 16px; }
        .role { font-style: italic; font-size: 14px; margin-bottom: 5px; }
        .date { font-size: 12px; color: #666; }
        ul { margin: 5px 0 0 20px; padding: 0; font-size: 14px; }
        li { margin-bottom: 3px; }
        .skills { display: flex; flex-wrap: wrap; gap: 8px; font-size: 14px; }
        .skill-tag { background: #eee; padding: 2px 6px; border-radius: 4px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${personal.name || ''}</h1>
        <div class="header-info">
          ${personal.email ? `<span class="header-item">${icons.email}${personal.email}</span>` : ''}
          ${personal.phone ? `<span class="header-item">${icons.phone}${personal.phone}</span>` : ''}
          ${personal.location ? `<span class="header-item">${icons.location}${personal.location}</span>` : ''}
        </div>
        ${personal.summary ? `<p style="margin-top: 10px; font-size: 14px;">${personal.summary}</p>` : ''}
      </div>

      ${education && education.length > 0 ? `
        <div class="section">
          <h2>Education</h2>
          ${education.map(edu => `
            <div class="item">
              <div class="item-header">
                <span class="company">${edu.institution}</span>
                <span class="date">${edu.start} - ${edu.end}</span>
              </div>
              <div class="role">${edu.degree}</div>
            </div>
          `).join('')}
        </div>
      ` : ''}

      ${experience && experience.length > 0 ? `
        <div class="section">
          <h2>Experience</h2>
          ${experience.map(exp => `
            <div class="item">
              <div class="item-header">
                <span class="company">${exp.company}</span>
                <span class="date">${exp.start} - ${exp.end || 'Present'}</span>
              </div>
              <div class="role">${exp.role}</div>
              <ul>
                ${exp.bullets.map(b => `<li>${b}</li>`).join('')}
              </ul>
            </div>
          `).join('')}
        </div>
      ` : ''}

      ${data.projects && data.projects.length > 0 ? `
        <div class="section">
          <h2>Projects</h2>
          ${data.projects.map(proj => `
            <div class="item">
              <div class="item-header">
                <span class="company">${proj.name}</span>
                <span class="date">${proj.start} - ${proj.end}</span>
              </div>
              <div class="role">${proj.role}</div>
              <ul>
                ${proj.bullets.map(b => `<li>${b}</li>`).join('')}
              </ul>
            </div>
          `).join('')}
        </div>
      ` : ''}

      ${skills && skills.length > 0 ? `
        <div class="section">
          <h2>Skills</h2>
          <div class="skills">
            ${skills.map(s => `<span class="skill-tag">${s}</span>`).join('')}
          </div>
        </div>
      ` : ''}
    </body>
    </html>
  `;
};

module.exports = renderClassic;
