all_nouns <- data.frame(noun=readLines('nounlist.txt')) 
filtered_nouns <- all_nouns%>%
  mutate(word_length = nchar(noun)) %>%
  filter(word_length==5) %>%
  mutate(third_letter = substr(noun,3,3)) %>%
  filter(third_letter == 'o' | third_letter=='r')
