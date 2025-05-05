'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { models, getProviderFromModelName, fetchModels, getModelNameWithoutProvider } from '@/app/data/models';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Button } from '@/components/ui/button';

const sortOptions = [
  { value: 'date', label: 'Sort by Release Date' },
  { value: 'name', label: 'Sort by Name' },
  { value: 'provider', label: 'Sort by Provider' },
  { value: 'price', label: 'Sort by Price' },
];

export default function ModelsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'provider' | 'price'>('date');
  const [providers, setProviders] = useState<string[]>([]);
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);
  const [sortOpen, setSortOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadModels() {
      setIsLoading(true);
      try {
        await fetchModels();
        // Extract unique providers
        const uniqueProviders = Array.from(new Set(models.map(model =>
          getProviderFromModelName(model.name)
        ))).sort();
        setProviders(uniqueProviders);
      } catch (error) {
        console.error('Failed to load models:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadModels();
  }, []);

  // Filter and sort models
  const filteredModels = models.filter(model => {
    const matchesSearch = model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      model.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProvider = selectedProviders.length === 0 ||
      selectedProviders.includes(getProviderFromModelName(model.name));
    return matchesSearch && matchesProvider;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'date':
        // Sort by created date (newest first)
        return b.created - a.created;
      case 'name':
        return getModelNameWithoutProvider(a.name).localeCompare(getModelNameWithoutProvider(b.name));
      case 'provider':
        return getProviderFromModelName(a.name).localeCompare(getProviderFromModelName(b.name));
      case 'price':
        return a.pricing.prompt - b.pricing.prompt;
      default:
        return 0;
    }
  });

  const handleProviderToggle = (provider: string) => {
    setSelectedProviders(prev =>
      prev.includes(provider)
        ? prev.filter(p => p !== provider)
        : [...prev, provider]
    );
  };

  return (
    <main className="flex min-h-screen flex-col bg-black text-white">
      <Header />

      <section className="py-16 bg-black">
        <div className="px-4 max-w-4xl mx-auto">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-6">Available Models</h1>
            <p className="text-xl text-gray-400 mb-10">
              Browse and compare {models.length} AI models available
            </p>

            {isLoading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-white"></div>
              </div>
            ) : (
              <>
                {/* Search and filters */}
                <div className="mb-10 flex flex-col md:flex-row gap-4">
                  <div className="flex-1 flex">
                    <input
                      type="text"
                      placeholder="Search models..."
                      className="w-full h-11 px-4 py-2 bg-black border border-white/20 rounded-md text-white focus:outline-none focus:ring-0 focus:border-white/20"
                      style={{ minHeight: 44, maxHeight: 44 }}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex items-stretch">
                    <Popover open={sortOpen} onOpenChange={setSortOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={sortOpen}
                          className="w-[260px] h-11 justify-between border-white/20 bg-black text-white hover:bg-white/5 hover:text-white px-4"
                          style={{ minHeight: 44, maxHeight: 44 }}
                        >
                          {sortOptions.find((option) => option.value === sortBy)?.label || "Sort by"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[260px] p-0 bg-black border border-white/20 text-white">
                        <Command className="bg-transparent">
                          <CommandList>
                            <CommandGroup>
                              {sortOptions.map((option) => (
                                <CommandItem
                                  key={option.value}
                                  value={option.value}
                                  onSelect={(value) => {
                                    setSortBy(value as 'date' | 'name' | 'provider' | 'price');
                                    setSortOpen(false);
                                  }}
                                  className="text-white hover:bg-white/10"
                                >
                                  {option.label}
                                  <Check
                                    className={cn(
                                      "ml-auto h-4 w-4",
                                      sortBy === option.value ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {/* Provider filters */}
                <div className="mb-8">
                  <h2 className="text-lg font-medium mb-3">Providers</h2>
                  <div className="flex flex-wrap gap-3">
                    {providers.map(provider => (
                      <button
                        key={provider}
                        className={`px-3 py-1 rounded-full text-sm ${selectedProviders.includes(provider)
                          ? 'bg-white text-black'
                          : 'bg-black border border-white/20 text-white'
                          }`}
                        onClick={() => handleProviderToggle(provider)}
                      >
                        {provider}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Models list */}
                <div className="grid grid-cols-1 gap-4">
                  {filteredModels.length > 0 ? (
                    filteredModels.map((model) => {
                      const provider = getProviderFromModelName(model.name);
                      const modelName = getModelNameWithoutProvider(model.name);

                      return (
                        <Link
                          key={model.id}
                          href={`/models/${model.id.replace('/', '/')}`}
                          className="block bg-black border border-white/10 rounded-lg p-6 hover:border-white/20 transition-all"
                        >
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                              <h3 className="text-xl font-bold text-white">{modelName}</h3>
                              <div className="flex items-center gap-2">
                                <p className="text-sm text-gray-500">{provider}</p>
                                <span className="text-xs text-gray-500">•</span>
                                <p className="text-xs text-gray-500">
                                  {new Date(model.created * 1000).toLocaleDateString(undefined, {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                  })}
                                </p>
                              </div>
                              <div className="flex flex-wrap gap-2 mt-2">
                                <span className="text-xs bg-white/10 px-2 py-1 rounded text-gray-300">
                                  {model.sats_pricing.prompt.toFixed(8)} sats/token input
                                </span>
                                <span className="text-xs bg-white/10 px-2 py-1 rounded text-gray-300">
                                  {model.sats_pricing.completion.toFixed(8)} sats/token output
                                </span>
                                <span className="text-xs bg-white/10 px-2 py-1 rounded text-gray-300">
                                  {model.context_length.toLocaleString()} tokens
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-400">View details</span>
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                              </svg>
                            </div>
                          </div>
                        </Link>
                      );
                    })
                  ) : (
                    <div className="text-center py-10 text-gray-400">
                      No models found matching your criteria
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
} 