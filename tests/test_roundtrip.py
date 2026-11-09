import sys
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'.deps'))
import io
import unittest
from core.baseline import generate, embed, extract, positions

class Flow(unittest.TestCase):
    def test_roundtrip(self):
        for key in ('','猫咪密钥'):
            for message in ('','你好🐱','a'*11960):
                im=embed(generate('https://example.com'),message,key)
                b=io.BytesIO(); im.save(b,format='PNG'); b.seek(0)
                from PIL import Image
                self.assertEqual(extract(Image.open(b),key)['secret'],message)
    def test_errors(self):
        im=generate('hello')
        with self.assertRaises(ValueError): embed(im,'a'*11961)
        out=embed(im,'secret','key')
        self.assertEqual(extract(out,'wrong')['status'],'unknown')
        x,y,c=positions(out,'key')[320]
        rgb=list(out.getpixel((x,y))); rgb[c]^=1;out.putpixel((x,y),tuple(rgb))
        self.assertEqual(extract(out,'key')['status'],'failed')

if __name__=='__main__': unittest.main()
