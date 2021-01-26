import { FormFile } from '../../testDeps.ts';

const validFile: {
  story: FormFile[];
  promptId: string;
} = {
  promptId: '1',
  story: [
    {
      content: new Uint8Array(),
      contentType: 'image/jpeg',
      filename: 'somefilename',
      name: 'story',
      size: 240,
    },
  ],
};

const invalidFile: {
  story: FormFile[];
  promptId: string;
} = {
  promptId: '1',
  story: [
    {
      content: new Uint8Array(),
      contentType: 'text/plain',
      filename: 'somefilename',
      name: 'story',
      size: 240,
    },
  ],
};

const invalidField = {
  promptId: '1',
  image: [
    {
      content: new Uint8Array(),
      contentType: 'text/plain',
      filename: 'somefilename',
      name: 'story',
      size: 240,
    },
  ],
};

const invalidPrompt = {
  promptId: '10',
  story: [
    {
      content: new Uint8Array(),
      contentType: 'image/jpeg',
      filename: 'somefilename',
      name: 'story',
      size: 240,
    },
  ],
};

export default { validFile, invalidField, invalidFile, invalidPrompt };
