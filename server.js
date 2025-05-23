import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';

const app = express();
const port = process.env.PORT || 3000;

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

app.use(cors({
  origin: 'https://certificadoonline.netlify.app', // URL do frontend
  methods: ['GET'],
  allowedHeaders: ['Content-Type']
}));

app.get('/certificados', async (req, res) => {
  try {
    const query = req.query.query?.trim().toLowerCase() || '';
    const queryLimpo = query.includes('@') ? query : query.replace(/[.-]/g, '');

    const { data, error } = await supabase
      .from('certificados')
      .select('nome, evento, link_certificado')
      .or(`cpf.eq.${queryLimpo},email.eq.${query}`);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json(data);
  } catch (e) {
    console.error('Erro inesperado:', e);
    return res.status(500).json({ error: 'Erro inesperado.' });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
