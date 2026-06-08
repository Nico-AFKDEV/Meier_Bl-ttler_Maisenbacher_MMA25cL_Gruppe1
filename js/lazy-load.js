/* 
   Lazy Load Video Script
   
   Dokumentation und Implementierung: Lazy Loading für Video.
   
   Basiert auf W3Schools:
   https://www.w3schools.com/jsref/api_intersectionobserver.asp
   https://www.w3schools.com/html/html5_video.asp
  
*/

// Start wenn Script geladen
document.addEventListener('DOMContentLoaded', function() {
    console.log('Lazy Load Script geladen - initialisiere Video Lazy Loading');
    initLazyLoadVideos();
});


function initLazyLoadVideos() {
    // Finde alle Videos mit der Klasse "lazy-video"
    const lazyVideos = document.querySelectorAll('.lazy-video');
    
    console.log(`${lazyVideos.length} Lazy Loading Video(s) gefunden`);
    
    // Wenn keine Videos gefunden, beende die Funktion
    if (lazyVideos.length === 0) {
        console.warn('Keine Videos mit Klasse "lazy-video" gefunden');
        return;
    }
    
    // Erstelle einen Intersection Observer
    // Der Observer erkennt, wenn ein Element in den sichtbaren Bereich kommt
    const videoObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(function(entry) {
            // entry.isIntersecting ist true wenn das Element sichtbar ist
            if (entry.isIntersecting) {
                loadVideo(entry.target);
                // Stoppe die Beobachtung nach dem Laden
                observer.unobserve(entry.target);
            }
        });
    }, {
        // Options für den Observer:
        // Margin: Lädt das Video 100px bevor es sichtbar wird
        rootMargin: '100px'
    });
    
    // Beobachte jedes Video
    lazyVideos.forEach(function(video) {
        videoObserver.observe(video);
    });
}

/**
Lädt ein Video

Diese Funktion:
1. Nimmt den data-src Attribut (echte Video-URL)
2. Setzt ihn in den src Attribut
3. Startet das Preloading des Videos
4. Gibt Feedback in der Console
 
  Parameter:
video - Das HTML Video-Element
 */
function loadVideo(video) {
    console.log('Lade Video: ' + video.getAttribute('data-src'));
    
    // Hole die echte Video-URL aus dem data-src Attribut
    const videoSrc = video.getAttribute('data-src');
    
    // Prüfe ob data-src vorhanden ist
    if (!videoSrc) {
        console.error('Fehler: data-src Attribut nicht vorhanden!');
        return;
    }
    
    // Setze den src Attribut zum Laden des Videos
    video.src = videoSrc;
    
    // Zeige Ladeeffekt
    video.classList.add('loading');
    
    // Wenn das Video geladen wurde, entferne den Loading-Effekt
    video.addEventListener('canplay', function() {
        console.log('Video erfolgreich geladen: ' + videoSrc);
        video.classList.remove('loading');
        video.classList.add('loaded');
    }, {once: true}); // {once: true} = Event Listener wird nur einmal ausgelöst
    
    // Fehlerbehandlung wenn Video nicht geladen werden kann
    video.addEventListener('error', function() {
        console.error('Fehler beim Laden des Videos: ' + videoSrc);
        video.classList.remove('loading');
        video.textContent = 'Video konnte nicht geladen werden';
    }, {once: true});
    
    // Starte das Laden des Videos
    video.load();
}

