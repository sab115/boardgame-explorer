// packages/proto/src/styles/headings.css.ts
import { css } from "lit";

const styles = css`
               h1,
               h2,
               h3,
               h4 {
                   font-family: var(--font-family-display);
                   font-weight: 700;
                   line-height: var(--line-height-heading);
                   color: var(--color-text);
                   margin-bottom: var(--space-2);
               }

h1 {
    font-size: 2rem;
}
h2 {
    font-size: 1.5rem;
}
h3 {
    font-size: 1.25rem;
}
`;

export default { styles };
