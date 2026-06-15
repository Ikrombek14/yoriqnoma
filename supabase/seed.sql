-- =============================================================
--  Boshlang'ich kontent (navigatsiya tuzilmasi)
--  schema.sql dan KEYIN ishga tushiring.
-- =============================================================

-- Asosiy bo'limlar
insert into public.sections (title, slug, icon, description, type, position) values
  ('Adminlar uchun qo''llanma', 'qollanma', '📘', 'Classroom — adminlar uchun umumiy qo''llanma', 'content', 1),
  ('Tizimda ishlash bo''yicha yo''riqnoma', 'yoriqnoma', '⚙️', 'Holly Hop, ERP va Bitrix tizimlari bo''yicha qadam-baqadam yo''riqnoma', 'content', 2),
  ('O''quv dasturi', 'oquv-dasturi', '🎓', 'Bosqichma-bosqich o''quv dasturi', 'content', 3),
  ('O''z-o''zini baholash', 'baholash', '📝', 'O''rgangan ko''nikmalaringizni test orqali tekshiring', 'tests', 4),
  ('To-do list', 'todo', '✅', 'Bajariladigan vazifalar ro''yxati', 'todo', 5),
  ('Career roadmap', 'roadmap', '🚀', 'Lavozim o''sishi yo''l xaritasi (administrativ jamoa va sotuv)', 'roadmap', 6)
on conflict (slug) do nothing;

-- Yo'riqnoma ostidagi kichik bo'limlar: Holly Hop, ERP, Bitrix
insert into public.sections (parent_id, title, slug, icon, description, type, position)
select s.id, v.title, v.slug, v.icon, v.description, 'content', v.position
from public.sections s
cross join (values
  ('Holly Hop', 'holly-hop', '🐇', 'Holly Hop tizimida ishlash', 1),
  ('ERP', 'erp', '🗂️', 'ERP tizimida ishlash', 2),
  ('Bitrix', 'bitrix', '🟦', 'Bitrix tizimida ishlash', 3)
) as v(title, slug, icon, description, position)
where s.slug = 'yoriqnoma'
on conflict (slug) do nothing;

-- Namuna maqola
insert into public.articles (section_id, title, body, position)
select id, 'Boshlash', e'Bu bo''lim adminlar uchun umumiy qo''llanma.\n\nMatnni va videolarni **Admin panel** orqali tahrirlashingiz mumkin.', 1
from public.sections where slug = 'qollanma'
on conflict do nothing;

-- Namuna roadmap bosqichlari
insert into public.roadmap_stages (track, title, description, requirements, level, position) values
  ('administrative', 'Junior Administrator', 'Boshlang''ich lavozim', e'- Tizimlar bilan tanishish\n- Asosiy jarayonlarni o''rganish', 1, 1),
  ('administrative', 'Administrator', 'O''rta bosqich', e'- Mustaqil ish yuritish\n- Test natijasi 80+', 2, 2),
  ('administrative', 'Senior Administrator', 'Yuqori bosqich', e'- Jamoaga yo''l-yo''riq berish\n- Jarayonlarni optimallashtirish', 3, 3),
  ('sales', 'Sotuv menejeri', 'Boshlang''ich sotuv lavozimi', e'- Sotuv skriptlarini o''rganish\n- CRM bilan ishlash', 1, 1),
  ('sales', 'Katta sotuv menejeri', 'Tajribali sotuvchi', e'- Reja bajarilishi 100%\n- Mijozlar bilan ishlash mahorati', 2, 2)
on conflict do nothing;

-- Namuna to-do
insert into public.todo_items (title, description, position) values
  ('Holly Hop bo''limini o''qib chiqish', 'Yo''riqnoma > Holly Hop', 1),
  ('ERP bo''limini o''rganish', 'Yo''riqnoma > ERP', 2),
  ('O''z-o''zini baholash testidan o''tish', 'Kamida 80 ball to''plang', 3)
on conflict do nothing;
