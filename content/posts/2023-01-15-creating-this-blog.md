+++
title = "Creating a blog with Zola, TailwindCSS, and Netlify"
date = 2023-01-15
description = "Setup a simple blog using Zola and TailwindCSS and deploy it to Netlify."
+++

## Introduction

It seems like such cliche to write about setting up a blog on that very same blog but it is a neccesary first step
and makes for an easy entrance point to start generating content. If you are happening to read this, I would first
like to point you into the direction of the resources that I used to generate this.

Firstly, a couple of blog posts very much like this one:

- [Zola Tutorial: How to use Zola the Rust based static site generator for your next small project, and deploy it on Netlify](https://dev.to/davidedelpapa/zola-tutorial-how-to-use-zola-the-rust-based-static-site-generator-for-your-next-small-project-and-deploy-it-on-netlify-375n)
- [Using Tailwind CSS with the Zola Static Site Generator](https://www.maybevain.com/writing/using-tailwind-css-with-zola-static-site-generator/)


And secondly --and perhaps more useful-- the documentation for Zola and Tailwind CSS themselves:

- [Zola](https://www.getzola.org/documentation/getting-started/overview/)
- [Install Tailwind CSS with Parcel](https://tailwindcss.com/docs/guides/parcel)


Blog posts are nice because they are typically more involved covering more domains and possibly leading to a complete
production-ready result; like this post. However, tool documentation remains king due to its depth and its high
probability to being up-to-date and almost always correct, something I ran into while setting up this blog which
lead me to the tool documentation which was much nicer to follow. If you are interested in setting up a blog using
this or a similar stack, I challenge you to first follow Zola's and tailwind's documentation as it is more than
sufficient to get going. Afterwards, please come back and continue reading; its probably not the best idea to tell my
readers to go away on my very first post.

## The What

When I went looking for tech to setup this blog, I had some pretty simple criteria I wanted to meet:

- Have a static site
- Style it quickly, easily, and have it look good
- Host it for cheap/free

### Zola

Zola is a static site generator written in Rust. In the past I have used other static site generators, primarily
Eleventy but this time around I wanted to try something different. Zola is a single binary, very fast, easy to use
static site generator. Personally, I like the idea of not having a bunch of dependencies floating around that
Dependabot will bug me about until the end of time; I'm sorry dependabot, I know there is a vulnerability,
I don't really use it, please leave me alone... Having said all that, my primary reason for choosing Zola is because
it is written in Rust. I am a huge fan of Rust using it for many of my personal projects and hopefully making
it a large source of content for this blog. Perhaps not the best reason but heh, what can you do?

### Tailwind CSS

Adam Wathan, the creator of Tailwind CSS, has a great [write up](https://adamwathan.me/css-utility-classes-and-separation-of-concerns/)
about CSS and separation of concerns that really resonated with me. Tailwind CSS allows you to easily compose from a set
of utility classes to get a beautiful --or at least ok looking-- website easily with a consistent look and feel.
Combining this with the static templates used in Zola allows us to make "reusuable" components quickly and easily.

### Netlify

Netlify has a pretty awesome free tier that will handle automatic builds and deploys triggered by Github merges.
While it could probably get expensive at large scales, that will never be a problem for a personal  blog. While there
are other similar offerings like Vercel, I already use Netlify for my personal website and have no urge to move away
from them now. Zola has [great documentation](https://www.getzola.org/documentation/deployment/overview/) for deploying
on a number of different platforms.

## The Why

TBD

## The How

```bash
$ zola init blog
$ cd blog
$ zola serve
```

![welcome to zola](/images/welcome-to-zola.png)

{% caption() %} templates/base.html {% end %}

```html
<!DOCTYPE html>
<html>
  <head>
    <title>{% block title %}{% endblock title %}</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
  </head>
  <body>
    <div>
      <nav>
        <a href="/">Home</a>
        <a href="/posts">Posts</a>
      </nav>
      <main>
        {% block content %}{% endblock content %}
      </main>
    </div>
  </body>
</html>
```

{% caption() %} templates/index.html {% end %}

```html
{% extends "base.html" %}

{% block title %}My Blog{% endblock title %}

{% block content %}
<article>
    <h1>Welcome to my blog!</h1>
</article>
{% endblock content %}
```

{% caption() %} content/posts/_index.md {% end %}

```md
+++
title = "Posts"
sort_by = "date"
template = "posts.html"
page_template = "post-page.html"
+++
```


{% caption() %} templates/posts.html {% end %}

```html
{% extends "base.html" %}
{% block title %}Posts{% endblock title %}
{% block content %}
  <h1>{{ section.title }}</h1>

  <div>
    {% for page in section.pages %}
    <div>
      <a href="{{ page.permalink }}">
        <div>
          {{ page.title }}
        </div>
      </a>
    </div>
    {% endfor %}
  </div>
{% endblock content %}
```

{% caption() %} content/posts/hello-world.md {% end %}

```md
+++
title = "Hello World!"
date = 2023-01-15
+++

# This is a header

## This is also a header

This is the body of the post!

- Some
- List
- Items

```html
<div>
    HTML in a code block!
</div
```

{% caption() %}
    templates/post-page.html
{% end %}

```html
{% extends "base.html" %}

{% block title %}{{ page.title }}{% endblock title %}

{% block content %}
  <h1>{{ page.title }}</h1>

  {% if page.toc %}
    <div>
      <ul>
      {% for h2 in page.toc %}
        <li>
            <a href="{{ h2.permalink | safe }}">{{ h2.title }}</a>
            {% if h2.children %}
              <ul>
                {% for h3 in h2.children %}
                  <li>
                    <a href="{{ h3.permalink | safe }}">{{ h3.title }}</a>
                  </li>
                {% endfor %}
              </ul>
            {% endif %}
        </li>
      {% endfor %}
      </ul>
    </div>
  {% endif %}

  {{ page.content | safe }}
{% endblock content %}
```

```bash
$ npm init
$ npm install parcel postcss tailwindcss
```

{% caption() %} tailwind.config.js {% end %}

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./templates/**/*.html",
        "./templates/shortcodes/**/*.html",  // Only required if using custom shortcodes
    ],
    theme: {
        extend: {},
    },
    plugins: [],
}
```

{% caption() %} package.json {% end %}

```json
"scripts": {
    "build": "parcel build styles/style.css --dist-dir static/dist --no-source-maps",
    "watch": "parcel watch styles/style.css --dist-dir static/dist --no-hmr --no-source-maps"
},
```

{% caption() %} styles/style.css {% end %}

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

{% caption() %} templates/base.html {% end %}

```html
<head>
    ...
    <link rel="stylesheet" href="{{/* get_url(path='dist/style.css', cachebust=true) */}}">
</head>
```

```bash
$ npm run watch
```

