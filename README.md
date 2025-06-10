# Themify for Thunderstore

This is a Chrome extension developed by me (@atomictyler) and released completely for free.  
It allows you to choose from a selection of premade themes for Thunderstore to customize your browsing experience.

**Made your own theme?** Submit a merge request! If it follows the contribution guidelines, it may be added to the official collection.

Licensed under the MIT license. Please submit merge requests instead of creating separate extensions per theme. You can include credit for your theme in the theme-index.json!

---

## Making Your Own Theme

Creating a theme may seem challenging at first, but it mostly involves using browser dev tools and some CSS tweaks.  
Make sure to **fully test your theme** before submitting a merge request.

|                            | Making a Custom CSS | Forking the Repo | Adding Your Theme | Submitting Merge Request |
|:--------------------------:|:-------------------:|:----------------:|:------------------:|:--------------------------:|
| **Step Completed?**        |          ❌         |        ❌         |         ❌         |             ❌             |

---

### Step 1: Making a Custom CSS Theme

Start by visiting a mod page that includes a sponsor button.  
You can use [this example](https://thunderstore.io/c/lethal-company/p/AtomicStudio/Colorable_CozyLights/) if you don't have one in mind.

> **Important:** Disable the Themify extension while editing to avoid interference.

#### How to Begin:
- Right-click an element you want to change.
- Select **Inspect** to open the dev tools, and modify styles in the **Styles** tab.
- Repeat until the whole page looks how you want it.
- **Do not refresh or switch pages!** Changes will be lost unless saved regularly.

#### Transferring Your CSS to Other Pages:
- Open the **Sources** tab in dev tools.
- Under **Page**, navigate to:  
  `top/thunderstore.io/static/css/all.*[random].css`
- Copy the entire contents of this file and save it somewhere (e.g., Notepad).
- Visit the Thunderstore homepage or another page.
- Navigate back to the same CSS file and paste in your saved styles to test them site-wide.

Once you're happy with the result:
- Copy and save your final CSS code — you’ll need this for the next step.

|                            | Making a Custom CSS | Forking the Repo | Adding Your Theme | Submitting Merge Request |
|:--------------------------:|:-------------------:|:----------------:|:------------------:|:--------------------------:|
| **Step Completed?**        |          ✅         |        ❌         |         ❌         |             ❌             |

---

### Step 2: Forking the Repository

To contribute your theme, you’ll need to fork the repository:

- Visit the [GitHub repo](https://github.com/AtomicTyler1/Thunderstore-Themify).
- Click the **Fork** button (top-right corner).
- Clone your forked repository locally:

  ```bash
  git clone https://github.com/YOUR-USERNAME/Thunderstore-Themify.git
  cd Thunderstore-Themify
  ```

|                            | Making a Custom CSS | Forking the Repo | Adding Your Theme | Submitting Merge Request |
|:--------------------------:|:-------------------:|:----------------:|:------------------:|:--------------------------:|
| **Step Completed?**        |          ✅         |        ✅         |         ❌         |             ❌             |

---

### Step 3: Adding Your Theme

Now that you have your custom CSS and the repo, it's time to implement your theme.

#### 1. Add Your CSS File
- Create a new file in `theme-styles/` named `theme-{your-theme-name}.css`.
- Paste in your saved CSS from Step 1.

#### 2. Edit `manifest.json`

Locate the `web_accessible_resources` section. It should look something like this:

```json
"web_accessible_resources": [
  {
    "resources": [
      "Icon.png",
      "theme-styles",
      "theme-index.json",
      "theme-styles/theme-dark-blue.css",
      "theme-styles/theme-default.css",
      "theme-styles/theme-red.css"
    ],
    "matches": ["<all_urls>"]
  }
]
```

- Add your theme to the list:
```json
"theme-styles/theme-{your-theme-name}.css"
```

> **Tip:** Don’t forget to add a comma to the previous line when inserting your theme!

#### 3. Edit `theme-index.json`

The file should look like this but perhaps with extra lines:

```json
{
  "themes": {
    "default": "theme-styles/theme-default.css",
    "dark-blue": "theme-styles/theme-dark-blue.css",
    "red": "theme-styles/theme-red.css"
  },
  "options": [
    { "value": "default", "label": "Default", "credits": "thunderstore.io" },
    { "value": "dark-blue", "label": "Dark Blue", "credits": "@atomictyler" },
    { "value": "red", "label": "Red", "credits": "@atomictyler" }
  ]
}
```

- Add your theme to both the `themes` and `options` sections.
- Ensure the `value` in options matches your theme key.
- The `label` is what will appear in the dropdown menu.
- Avoid using a name already taken by another theme.
- Do NOT attempt to change the credits of an existing theme contact me @atomictyler on discord to discuss credit changes.
- Don’t forget commas between entries, except after the final one.

|                            | Making a Custom CSS | Forking the Repo | Adding Your Theme | Submitting Merge Request |
|:--------------------------:|:-------------------:|:----------------:|:------------------:|:--------------------------:|
| **Step Completed?**        |          ✅         |        ✅         |         ✅         |             ❌             |

---

### Step 4: Submitting a Merge Request

Once everything’s set up and tested:

- Stage and commit your changes:

  ```bash
  git add .
  git commit -m "Add new theme: [Your Theme Name]"
  ```

- Push to your fork:

  ```bash
  git push origin main
  ```

- Go to the original GitHub repo and open a **Pull Request**.

Include the following in your PR description:
- Theme name and short description
- Screenshots (if possible)
- Any credits you'd like to include

|                            | Making a Custom CSS | Forking the Repo | Adding Your Theme | Submitting Merge Request |
|:--------------------------:|:-------------------:|:----------------:|:------------------:|:--------------------------:|
| **Step Completed?**        |          ✅         |        ✅         |         ✅         |             ✅             |

---

## Notes

- Make sure your theme works across various Thunderstore pages.
- Keep your CSS scoped — avoid affecting unrelated UI components.
- Comment your CSS if needed for clarity.
- If your theme breaks core functionality, it won’t be accepted.

---