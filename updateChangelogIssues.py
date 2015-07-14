import fileinput
import re

linkHref = "https://github.com/mjamry/youtubeScrobbler/issues/"
 
for line in fileinput.input("src/CHANGELOG.html",inplace=1):
    line = re.sub(r'$$([0-9]+)', r'<a target="_blank" href="https://github.com/mjamry/youtubeScrobbler/issues/\1">#\1</a>', line.rstrip())
    print(line)