import { createClient } from '@supabase/supabase-js';

// Configura tu URL y clave pública de Supabase
const supabaseUrl = 'https://xyinlbwipdupxahnyiid.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5aW5sYndpcGR1cHhhaG55aWlkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTAwNjMwOSwiZXhwIjoyMDc0NTgyMzA5fQ.PtgYW7fjapn5o5u2if-7TZOcstUQs7as83UVG2tnNpw'; // Usa la clave pública (anon key)

const supabase = createClient(supabaseUrl, supabaseKey);

async function getJwt() {
  try {
    // Inicia sesión con las credenciales del usuario
    const { data, error } = await supabase.auth.signInWithPassword({
      email: '1aen9lomnc@osxofulk.com', // Reemplaza con el correo del usuario
      password: '123456', // Reemplaza con la contraseña del usuario
    });

    if (error) {
      console.error('Error logging in:', error.message);
      return;
    }

    // Muestra el JWT en la consola
    console.log('JWT:', data.session?.access_token);
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

getJwt();
