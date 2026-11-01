import tailwindcss from '@tailwindcss/postcss'

export default {
  plugins: [
    tailwindcss(),
    {
      postcssPlugin: 'postcss-fix-from',
      Once(root) {
        if (root.source?.input?.file) {
          root.walkDecls((decl) => {
            if (!decl.source?.input?.file) {
              decl.source = root.source
            }
          })
        }
      },
    },
  ],
}
