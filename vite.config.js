import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    // Define o diretório de saída para os arquivos compilados.
    // Você vai copiar o conteúdo desta pasta para o seu projeto original.
    outDir: '../dist-vue-tracking', // Exemplo: cria uma pasta "dist-vue-tracking" fora da pasta do projeto Vue

    // Configura a build como uma biblioteca para gerar um único arquivo JS
    // que pode ser facilmente incluído em um HTML existente.
    lib: {
      entry: path.resolve(__dirname, 'src/main.js'), // O ponto de entrada do seu app Vue
      name: 'TrackMAILTrackingApp', // Nome global da sua biblioteca (opcional)
      fileName: (format) => `trackmail-tracking-app.${format}.js` // Nome do arquivo de saída
    },
    // Garante que o Vue e outras dependências não sejam empacotadas no arquivo final,
    // assumindo que eles já serão carregados via CDN ou de outra forma no HTML principal.
    // Para simplificar, vamos empacotar tudo por enquanto.
    // rollupOptions: {
    //   external: ['vue'],
    //   output: {
    //     globals: {
    //       vue: 'Vue'
    //     }
    //   }
    // }
  }
})
