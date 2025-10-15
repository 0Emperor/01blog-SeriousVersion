// import 'highlight.js/styles/github-dark.css';
import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors,  } from '@angular/common/http';
import { authInterceptor } from './interceptor';
import { MarkdownModule, MARKED_OPTIONS } from 'ngx-markdown';
import hljs from 'highlight.js'; 
import { marked, Tokens } from 'marked';
const renderer = new marked.Renderer();

renderer.code = ({ text, lang, escaped }: Tokens.Code): string => {
  let highlighted: string;

  if (lang && hljs.getLanguage(lang)) {
    highlighted = hljs.highlight(text, { language: lang }).value;
  } else {
    highlighted = hljs.highlightAuto(text).value;
  }

  return `<pre><code class="hljs ${lang || ''}">${highlighted}</code></pre>`;
};
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withFetch(),withInterceptors([authInterceptor])),
    provideRouter(routes),
    importProvidersFrom(
      MarkdownModule.forRoot({
        markedOptions: {
          provide: MARKED_OPTIONS,
          useValue: {
            gfm: true,
            breaks: false,
            renderer: renderer,
          },
        },
      })
    ),
  ]
};