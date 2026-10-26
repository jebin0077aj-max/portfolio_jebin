
/* =====================================
   JEBIN V. - PORTFOLIO JAVASCRIPT
   ===================================== */

const GITHUB_USERNAME = "jebin0077aj-max";

// Update the copyright year automatically.
document.getElementById("year").textContent =
    new Date().getFullYear();


// MOBILE NAVIGATION

const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");

menuToggle.addEventListener("click", function () {
    const isOpen = nav.classList.toggle("open");

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.textContent = isOpen ? "✕" : "☰";
});

// Close the mobile menu after clicking a link.
nav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
        nav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.textContent = "☰";
    });
});


// LIGHT / DARK THEME

const themeToggle = document.getElementById("themeToggle");

themeToggle.addEventListener("click", function () {
    document.body.classList.toggle("light-theme");

    const isLight =
        document.body.classList.contains("light-theme");

    themeToggle.textContent = isLight ? "☾" : "☼";
    themeToggle.setAttribute(
        "aria-label",
        isLight ? "Switch to dark theme" : "Switch to light theme"
    );
});


// GITHUB PROJECTS

const projectGrid = document.getElementById("projectGrid");

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, function (char) {
        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return entities[char];
    });
}

function formatProjectName(name) {
    return name
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, function (letter) {
            return letter.toUpperCase();
        });
}

function createProjectCard(repo, index) {
    const projectName = formatProjectName(repo.name);

    const description = repo.description ||
        "Explore the source code and details in this GitHub repository.";

    const language = repo.language || "Source Code";

    const symbols = ["{ }", "</>", "⌘", "✦", "↗"];
    const symbol = symbols[index % symbols.length];

    return `
        <article class="project-card glass-card">
            <div class="project-art">
                <span class="art-label">
                    ${escapeHTML(language.toUpperCase())}
                </span>

                <span style="
                    font-size: 65px;
                    font-weight: 800;
                    color: #d0cbff80;
                ">${symbol}</span>
            </div>

            <div class="project-info">
                <span class="project-type">
                    ${escapeHTML(language.toUpperCase())}
                </span>

                <h3>${escapeHTML(projectName)}</h3>

                <p>${escapeHTML(description)}</p>

                <div class="project-bottom">
                    <div class="tags">
                        <span>${escapeHTML(language)}</span>
                        <span>GitHub</span>
                    </div>

                    <a
                        href="${escapeHTML(repo.html_url)}"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        View Project ↗
                    </a>
                </div>
            </div>
        </article>
    `;
}

async function loadGitHubProjects() {
    const apiURL =
        `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`;

    try {
        const response = await fetch(apiURL);

        if (!response.ok) {
            throw new Error("Unable to fetch GitHub repositories.");
        }

        const repositories = await response.json();

        // Show only original public repositories.
        const projects = repositories
            .filter(function (repo) {
                return !repo.fork && repo.name !== "portfolio_resume";
            })
            .sort(function (a, b) {
                return new Date(b.updated_at) - new Date(a.updated_at);
            })
            .slice(0, 5);

        if (projects.length === 0) {
            showGitHubFallback();
            return;
        }

        // Keep the featured retail billing project already in HTML.
        const projectCards = projects.map(function (repo, index) {
            return createProjectCard(repo, index);
        });

        projectGrid.insertAdjacentHTML(
            "beforeend",
            projectCards.join("")
        );

    } catch (error) {
        console.error("GitHub projects:", error.message);
        showGitHubFallback();
    }
}

function showGitHubFallback() {
    const fallback = document.createElement("div");
    fallback.className = "glass-card";
    fallback.style.padding = "24px";

    fallback.innerHTML = `
        <h3>Explore more of my work</h3>
        <p style="color: var(--muted); margin: 10px 0;">
            My GitHub projects could not load right now.
            Visit my profile to see all public repositories.
        </p>
        <a
            class="text-link"
            href="https://github.com/${GITHUB_USERNAME}?tab=repositories"
            target="_blank"
            rel="noopener noreferrer"
        >
            View GitHub repositories ↗
        </a>
    `;

    projectGrid.appendChild(fallback);
}

// Load the repositories when the page opens.
loadGitHubProjects();
