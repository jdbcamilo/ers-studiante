<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;

class ChatController extends Controller
{
    public function index()
    {
        return Inertia::render('chat');
    }

    public function message(Request $request)
    {
        $message = $request->input('message');

        if (empty($message)) {
            return response()->json(['reply' => 'No he recibido ningún mensaje. ¿Cómo te sientes hoy?']);
        }

        // 1. Professional, Unlimited DeepSeek API Integration (OpenAI compatible)
        $deepseekKey = env('DEEPSEEK_API_KEY');
        if (!empty($deepseekKey)) {
            try {
                $systemInstruction = "Eres un psicólogo y consejero de salud mental sumamente empático, cálido, respetuoso y profesional de la Universidad de Córdoba, Colombia. Responde en español de forma cariñosa, clara y concisa (máximo 3 oraciones) para ayudar al estudiante a calmarse ante el estrés académico o la ansiedad. Nunca menciones que eres una IA, mantén siempre el rol de consejero universitario.";
                
                $response = Http::timeout(10)->withHeaders([
                    'Authorization' => "Bearer {$deepseekKey}",
                    'Content-Type' => 'application/json'
                ])->post("https://api.deepseek.com/chat/completions", [
                    'model' => 'deepseek-chat',
                    'messages' => [
                        ['role' => 'system', 'content' => $systemInstruction],
                        ['role' => 'user', 'content' => $message]
                    ]
                ]);

                if ($response->successful()) {
                    $data = $response->json();
                    $replyText = $data['choices'][0]['message']['content'] ?? '';
                    if (!empty(trim($replyText))) {
                        return response()->json(['reply' => trim($replyText)]);
                    }
                }
            } catch (\Exception $e) {
                // Log and continue to Gemini fallback
            }
        }

        // 2. High-Performance Google Gemini Free API Integration
        $geminiKey = env('GEMINI_API_KEY');
        if (!empty($geminiKey)) {
            try {
                $systemInstruction = "Eres un psicólogo y consejero de salud mental sumamente empático, cálido, respetuoso y profesional de la Universidad de Córdoba, Colombia. Responde en español de forma cariñosa, clara y concisa (máximo 3 oraciones) para ayudar al estudiante a calmarse ante el estrés académico o la ansiedad. Nunca menciones que eres una IA, mantén siempre el rol de consejero universitario.";
                
                $response = Http::timeout(8)->post("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={$geminiKey}", [
                    'contents' => [
                        [
                            'parts' => [
                                ['text' => "Instrucciones de Rol: {$systemInstruction}\n\nMensaje del estudiante: {$message}"]
                            ]
                        ]
                    ]
                ]);

                if ($response->successful()) {
                    $data = $response->json();
                    $replyText = $data['candidates'][0]['content']['parts'][0]['text'] ?? '';
                    if (!empty(trim($replyText))) {
                        return response()->json(['reply' => trim($replyText)]);
                    }
                }
            } catch (\Exception $e) {
                // Log and continue to Pollinations fallback
            }
        }

        // 3. Pollinations AI free text GET endpoint (as keyless public backup)
        try {
            $systemInstruction = "Instrucciones: Eres un psicólogo y consejero de salud mental sumamente empático, cálido, respetuoso y profesional de la Universidad de Córdoba, Colombia. Responde en español de forma cariñosa, clara y concisa (máximo 3 oraciones) para ayudar al estudiante a calmarse ante el estrés académico o la ansiedad. Nunca menciones que eres una IA, mantén siempre el rol de consejero universitario. Mensaje del estudiante: ";
            // Clean characters like ?, ¿, #, & that break Nginx/Cloudflare URL path routing
            $cleanMessage = str_replace(['?', '¿', '#', '&'], ' ', $message);
            $prompt = urlencode($systemInstruction . $cleanMessage);
            
            $response = Http::timeout(12)->get("https://text.pollinations.ai/{$prompt}");

            if ($response->successful()) {
                $replyText = $response->body();
                if (!empty(trim($replyText)) && !str_contains($replyText, 'error') && !str_contains($replyText, '429') && !str_contains($replyText, 'Queue full')) {
                    return response()->json(['reply' => trim($replyText)]);
                }
            }
        } catch (\Exception $e) {
            // Continue to local fallback
        }

        // 3. Secondary Local Static Fallback
        $reply = $this->getLocalResponse($message);
        return response()->json(['reply' => $reply]);
    }

    private function getLocalResponse(string $message): string
    {
        $lower = mb_strtolower($message, 'UTF-8');

        if (str_contains($lower, 'estres') || str_contains($lower, 'estrés') || str_contains($lower, 'examen') || str_contains($lower, 'parcial') || str_contains($lower, 'parciales') || str_contains($lower, 'materia') || str_contains($lower, 'universidad')) {
            return 'Comprendo perfectamente la enorme exigencia y la presión que conllevan los parciales en la Universidad de Córdoba. La sobrecarga académica es real. Te sugiero tomar un pequeño descanso de 5 minutos, realizar el ejercicio de "Respiración Cuadrada" que tienes en la pestaña de Recursos y organizar tus temas de estudio uno a la vez. ¿Te gustaría que hablemos sobre cómo organizar tus tiempos para mitigar esta carga?';
        }

        if (str_contains($lower, 'ansiedad') || str_contains($lower, 'ansioso') || str_contains($lower, 'nervio') || str_contains($lower, 'nervios') || str_contains($lower, 'miedo') || str_contains($lower, 'pánico')) {
            return 'Lamento mucho que te sientas con ansiedad en este momento. Puede ser una sensación muy abrumadora en el pecho y el estómago. Intenta colocar tu espalda recta en tu silla, siente tus pies bien apoyados en el suelo y realiza una exhalación lenta. Estoy aquí para escucharte y apoyarte. ¿Qué crees que ha desencadenado este pico de ansiedad hoy?';
        }

        if (str_contains($lower, 'triste') || str_contains($lower, 'tristeza') || str_contains($lower, 'depre') || str_contains($lower, 'desanimo') || str_contains($lower, 'desanimado') || str_contains($lower, 'llorar')) {
            return 'Siento mucho que estés pasando por un momento difícil. Es completamente normal y válido no tener las fuerzas al 100% todos los días. Cuidar de tu energía mental es prioritario. No te exijas de más hoy, mereces autocompasión. ¿Hay alguna actividad reconfortante que suela traerte tranquilidad, como caminar por el campus o charlar con alguien de confianza?';
        }

        if (str_contains($lower, 'hola') || str_contains($lower, 'buenos') || str_contains($lower, 'buenas') || str_contains($lower, 'saludos')) {
            $name = auth()->user()->name ?? 'Estudiante';
            return "¡Hola, {$name}! Qué gusto saludarte hoy. Cuéntame, ¿cómo ha estado tu día y de qué manera te gustaría que exploremos tu bienestar emocional en este momento?";
        }

        if (str_contains($lower, 'gracias') || str_contains($lower, 'agradecido') || str_contains($lower, 'ayuda')) {
            return '¡Con el mayor de los gustos! Recuerda que cuidar de tu mente es tan importante como tus notas de clase. Estoy siempre a un mensaje de distancia si necesitas desahogarte o respirar. ¡Mucho ánimo!';
        }

        return 'Te escucho atentamente. Expresar lo que llevas dentro es un paso fundamental para procesar las emociones universitarias. En la Universidad de Córdoba nos importa tu bienestar. ¿Te gustaría contarme un poco más al respecto?';
    }
}
