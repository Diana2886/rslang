import Model, { baseURL } from '../model/components/index';

class TextbookController {
  listenPlayWordButton(page: number, group: number) {
    document.body.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const audioPlay = (paths: string[]) => {
        const audio = new Audio(paths[0]);
        audio.autoplay = true;
        audio.onended = () => {
          for (let i = 1; i < paths.length; i += 1) {
            paths.shift();
            audioPlay(paths);
          }
        };
      };
      if (target.classList.contains('word__play')) {
        (async () => {
          const words = await Model.getWords(page, group);
          words.forEach((item) => {
            const audios = [
              `${baseURL}/${item.audio}`,
              `${baseURL}/${item.audioMeaning}`,
              `${baseURL}/${item.audioExample}`,
            ];
            if (item.id === target.id) {
              audioPlay(audios);
            }
          });
        })().catch((err: Error) => console.warn(err.message));
      }
    });
  }
}

export default TextbookController;
