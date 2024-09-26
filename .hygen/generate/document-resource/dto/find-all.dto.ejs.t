---
to: src/<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>/dto/find-all-<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>.dto.ts
---
import {InfinityFindAllDto} from '@src/utils/dto/infinity-query-all.dto'

export class FindAll<%= h.inflection.transform(name, ['pluralize']) %>Dto extends InfinityFindAllDto {}
