import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const supabaseUrl = 'https://dcuwakwpkmlrfvaxiiak.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRjdXdha3dwa21scmZ2YXhpaWFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1NjM1MzksImV4cCI6MjA4MDEzOTUzOX0.fcQv0963mbCA6IT6Hwkpn1PgGYYSB3zZEjGCfC3dXXg';

const supabase = createClient(supabaseUrl, supabaseKey);

async function uploadFile() {
  try {
    console.log('📦 Leyendo archivo...');
    const fileBuffer = readFileSync('humanbiblio-github-update.tar.gz');
    
    console.log('☁️  Subiendo a Supabase Storage...');
    const { data, error } = await supabase.storage
      .from('humanbiblio-media')
      .upload('downloads/humanbiblio-github-update.tar.gz', fileBuffer, {
        contentType: 'application/gzip',
        upsert: true
      });

    if (error) {
      console.error('❌ Error:', error);
      return;
    }

    console.log('✅ Archivo subido:', data);
    
    const { data: urlData } = supabase.storage
      .from('humanbiblio-media')
      .getPublicUrl('downloads/humanbiblio-github-update.tar.gz');
    
    console.log('\n🎉 LINK PÚBLICO LISTO:');
    console.log('\n' + urlData.publicUrl);
    console.log('\n');
  } catch (err) {
    console.error('❌ Error:', err);
  }
}

uploadFile();
